import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

// Service role client to bypass RLS for system updates
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseKey
)

const PLATFORM_FEE_PERCENT = 0.05 // 5% as agreed

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get('Stripe-Signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    if (!sig || !webhookSecret) return new NextResponse('Webhook secret not found', { status: 400 })
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const donationId = session.metadata.donation_id
    const fundraiserId = session.metadata.fundraiser_id

    if (!donationId || !fundraiserId) {
      return new NextResponse('Missing metadata', { status: 400 })
    }

    try {
      // 1. Calculate fees and net amount
      const totalAmount = session.amount_total // in cents
      const platformFee = Math.round(totalAmount * PLATFORM_FEE_PERCENT)
      const netAmount = totalAmount - platformFee

      // 2. Update donation record
      const { error: donationError } = await supabaseAdmin
        .from('donations')
        .update({ 
          status: 'succeeded',
          platform_fee: platformFee,
          net_amount: netAmount 
        })
        .eq('id', donationId)

      if (donationError) throw donationError

      // 3. Update fundraiser totals (Atomic increment using RPC or fetch+update)
      // Since we want accuracy, let's use a stored procedure (RPC) for atomicity
      // or a simple fetch and update for the MVP
      
      const { data: fundraiser, error: fetchError } = await supabaseAdmin
        .from('fundraisers')
        .select('raised_amount, donor_count')
        .eq('id', fundraiserId)
        .single()

      if (fetchError) throw fetchError

      const { error: fundraiserError } = await supabaseAdmin
        .from('fundraisers')
        .update({
          raised_amount: fundraiser.raised_amount + netAmount,
          donor_count: fundraiser.donor_count + 1
        })
        .eq('id', fundraiserId)

      if (fundraiserError) throw fundraiserError

      console.log(`Successfully processed donation ${donationId} for fundraiser ${fundraiserId}`)

    } catch (error: any) {
      console.error('Database Update Error:', error)
      return new NextResponse('Internal Server Error', { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
