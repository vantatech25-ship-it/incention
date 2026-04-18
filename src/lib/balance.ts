import { createClient } from '@/lib/supabase/server'
import { PLATFORM_FEE_PERCENT } from './constants'

export async function getFundraiserBalance(fundraiserId: string) {
  const supabase = createClient()

  // 1. Get all successful donations
  const { data: donations } = await supabase
    .from('donations')
    .select('amount, net_amount')
    .eq('fundraiser_id', fundraiserId)
    .eq('status', 'succeeded')

  const totalRaised = donations?.reduce((acc, curr) => acc + curr.amount, 0) || 0
  
  // We calculate net availability: Sum of net_amount (amount after platform fee)
  const totalNet = donations?.reduce((acc, curr) => acc + (curr.net_amount || (curr.amount * (1 - PLATFORM_FEE_PERCENT))), 0) || 0

  // 2. Get all successful and pending withdrawals
  const { data: withdrawals } = await supabase
    .from('withdrawals')
    .select('amount')
    .eq('fundraiser_id', fundraiserId)
    .in('status', ['pending', 'approved', 'completed'])

  const totalWithdrawn = withdrawals?.reduce((acc, curr) => acc + curr.amount, 0) || 0

  // 3. Calculate available
  const availableToWithdraw = Math.max(0, Math.floor(totalNet - totalWithdrawn))

  return {
    totalRaised,
    totalNet,
    platformFees: totalRaised - totalNet,
    totalWithdrawn,
    availableToWithdraw
  }
}
