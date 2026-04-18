import { Container } from '@/components/shared/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, Landmark, History, Plus, AlertCircle, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { getFundraiserBalance } from '@/lib/balance'
import { CURRENCY_SYMBOL } from '@/lib/constants'
import { WithdrawalHistory } from '@/components/dashboard/withdrawal-history'
import { WithdrawalRequestForm } from '@/components/dashboard/withdrawal-request-form'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'

export default async function WithdrawalsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch organizers fundraisers
  const { data: fundraisers } = await supabase
    .from('fundraisers')
    .select('id, title, slug')
    .eq('organizer_id', user?.id)

  // For simplicity in the MVP, we aggregate balance across all fundraisers 
  // or allow selecting one. Here we'll calculate totals for the overview.
  let totalAvailable = 0
  let totalWithdrawn = 0
  
  const balances = await Promise.all(
    (fundraisers || []).map(f => getFundraiserBalance(f.id))
  )

  balances.forEach(b => {
    totalAvailable += b.availableToWithdraw
    totalWithdrawn += b.totalWithdrawn
  })

  return (
    <Container>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight">Withdrawals</h1>
            <p className="text-muted-foreground">Manage your payouts and banking details securely.</p>
          </div>
          
          <Dialog>
          <DialogTrigger 
            render={
              <Button size="lg" className="rounded-2xl font-bold h-12 shadow-lg shadow-primary/20" disabled={totalAvailable < 10000}>
                <Plus className="mr-2 h-5 w-5" />
                Request Withdrawal
              </Button>
            }
          />
            <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none transition-all">
               <WithdrawalRequestForm fundraisers={fundraisers || []} balances={balances} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="border-none shadow-xl shadow-black/[0.03] rounded-[2rem] bg-emerald-600 text-white">
              <CardContent className="p-8 space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
                       <Wallet className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-1 rounded-full">Available</span>
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Available to Withdraw</p>
                    <p className="text-4xl font-black tracking-tighter">{CURRENCY_SYMBOL}{(totalAvailable / 100).toLocaleString()}</p>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-xl shadow-black/[0.03] rounded-[2rem] bg-white dark:bg-zinc-900 overflow-hidden">
              <CardContent className="p-8 space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                       <History className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Lifetime</span>
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Withdrawn</p>
                    <p className="text-4xl font-black tracking-tighter">{CURRENCY_SYMBOL}{(totalWithdrawn / 100).toLocaleString()}</p>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-xl shadow-black/[0.03] rounded-[2rem] bg-white dark:bg-zinc-900 overflow-hidden">
              <CardContent className="p-8 space-y-4">
                 <div className="flex items-center gap-3 text-amber-600">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-bold">Important Information</p>
                 </div>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                   Withdrawals are processed within 2-3 business days. Minimum withdrawal amount is <strong>{CURRENCY_SYMBOL}100</strong>. Make sure your bank details are 100% accurate.
                 </p>
              </CardContent>
           </Card>
        </div>

        {/* Withdrawal History Table */}
        <div className="space-y-6 pt-4">
           <div className="flex items-center gap-2">
              <Landmark className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold tracking-tight">Withdrawal History</h3>
           </div>
           
           <Card className="border-none shadow-xl shadow-black/[0.03] rounded-[2.5rem] bg-white dark:bg-zinc-900 overflow-hidden">
              <WithdrawalHistory />
           </Card>
        </div>
      </div>
    </Container>
  )
}
