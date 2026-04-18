'use server'

import { createClient } from '@/lib/supabase/server'
import { getFundraiserBalance } from '@/lib/balance'
import { revalidatePath } from 'next/cache'

interface WithdrawalParams {
  fundraiserId: string
  amount: number
  bankDetails: {
    accountHolder: string
    bankName: string
    accountNumber: string
    branchCode: string
    accountType: string
  }
}

export async function requestWithdrawal(params: WithdrawalParams) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }

  try {
    // 1. Double-check ownership
    const { data: fundraiser } = await supabase
      .from('fundraisers')
      .select('organizer_id')
      .eq('id', params.fundraiserId)
      .single()

    if (fundraiser?.organizer_id !== user.id) {
       return { success: false, error: 'Unauthorized operation' }
    }

    // 2. Double-check balance on the server side (Source of Truth)
    const { availableToWithdraw } = await getFundraiserBalance(params.fundraiserId)

    if (params.amount < 10000) { // R100 in cents
       return { success: false, error: 'Minimum withdrawal is R100' }
    }

    if (params.amount > availableToWithdraw) {
       return { success: false, error: 'Insufficient funds' }
    }

    // 3. Create withdrawal record
    const { error: withdrawalError } = await supabase
      .from('withdrawals')
      .insert([{
        fundraiser_id: params.fundraiserId,
        amount: params.amount,
        bank_details: params.bankDetails,
        status: 'pending'
      }])

    if (withdrawalError) throw withdrawalError

    revalidatePath('/dashboard/withdrawals')
    return { success: true }

  } catch (error: any) {
    console.error('Withdrawal Request Error:', error)
    return { success: false, error: error.message || 'Failed to process request' }
  }
}
