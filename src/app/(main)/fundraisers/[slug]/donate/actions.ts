'use client'

import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/client'

interface CheckoutParams {
  fundraiserId: string
  slug: string
  amount: number
  donorName: string
  message: string
  isAnonymous: boolean
}

export async function createCheckoutSession(params: CheckoutParams) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    // 1. Create a pending donation record in Supabase
    const { data: donation, error: dbError } = await supabase
      .from('donations')
      .insert([{
        fundraiser_id: params.fundraiserId,
        donor_id: user?.id || null, // Can be null for guest donations
        amount: params.amount,
        donor_name: params.donorName || 'Anonymous',
        message: params.message,
        is_anonymous: params.isAnonymous,
        status: 'pending' // Important: remains pending until webhook triggers
      }])
      .select()
      .single()

    if (dbError) throw dbError

    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'zar',
            product_data: {
              name: `Donation to Inception Fundraiser`,
              description: `Support for campaign #${params.slug}`,
            },
            unit_amount: params.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/fundraisers/${params.slug}?success=true&donation_id=${donation.id}`,
      cancel_url: `${appUrl}/fundraisers/${params.slug}/donate`,
      metadata: {
        donation_id: donation.id,
        fundraiser_id: params.fundraiserId,
        is_anonymous: params.isAnonymous ? 'true' : 'false',
      },
    })

    // 3. Update donation with Stripe Session ID
    await supabase
      .from('donations')
      .update({ stripe_id: session.id })
      .eq('id', donation.id)

    return { url: session.url }
  } catch (error: any) {
    console.error('Stripe Error:', error)
    throw new Error(error.message || "Failed to initiate payment")
  }
}
