import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Container } from '@/components/shared/container'
import { WithdrawalHistory } from '@/components/dashboard/withdrawal-history'
import { WithdrawalRequestForm } from '@/components/dashboard/withdrawal-request-form'
import { getFundraiserBalance } from '@/lib/balance'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function WithdrawalsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: fundraisers } = await supabase
    .from('fundraisers')
    .select('*, donations(*), withdrawals(*)')
    .eq('user_id', user.id)

  if (!fundraisers || fundraisers.length === 0) {
    return (
      <Container className="py-12">
        <Card>
          <CardHeader>
            <CardTitle>No Fundraisers Found</CardTitle>
            <CardDescription>You need to create a fundraiser before you can withdraw funds.</CardDescription>
          </CardHeader>
        </Card>
      </Container>
    )
  }

  const fundraiser = fundraisers[0] 
  const balanceData = await getFundraiserBalance(fundraiser.id)

  return (
    <Container className="py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Withdraw Funds</h1>
        <p className="text-muted-foreground">Manage your payouts and bank details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Available for Withdrawal</CardTitle>
              <div className="text-4xl font-black">R{balanceData.availableToWithdraw.toLocaleString()}</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Total Raised</span>
                <span className="font-bold">R{balanceData.totalRaised.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Platform Fees (5%)</span>
                <span className="font-bold">-R{balanceData.platformFees.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm italic">
                <span className="opacity-70">Already Withdrawn</span>
                <span className="font-bold">-R{balanceData.totalWithdrawn.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Payout Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-400">
                Payouts are processed within 2-3 business days to your South African bank account.
              </div>
              <ul className="list-disc pl-4 space-y-2 opacity-70 italic">
                <li>Minimum withdrawal: R100</li>
                <li>Valid SA Bank Account required</li>
                <li>Manual verification for first payout</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <WithdrawalRequestForm 
            fundraisers={[fundraiser]} 
            balances={[balanceData]} 
          />
          <Separator />
          <div className="space-y-4">
             <h2 className="text-xl font-bold">Withdrawal History</h2>
            <WithdrawalHistory />
          </div>
        </div>
      </div>
    </Container>
  )
}
