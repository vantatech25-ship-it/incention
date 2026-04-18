'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CURRENCY_SYMBOL } from '@/lib/constants'
import { format } from 'date-fns'
import { Landmark, Clock, CheckCircle2, XCircle } from 'lucide-react'

export function WithdrawalHistory() {
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('withdrawals')
        .select('*, fundraiser:fundraisers(title)')
        .order('created_at', { ascending: false })

      if (data) setWithdrawals(data)
      setLoading(false)
    }
    fetchHistory()
  }, [supabase])

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
         <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
         <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading history...</p>
      </div>
    )
  }

  if (withdrawals.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
         <Landmark className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
         <div className="space-y-1">
            <p className="font-bold text-lg">No withdrawals yet</p>
            <p className="text-sm text-muted-foreground">Your payout history will appear here once you make your first request.</p>
         </div>
      </div>
    )
  }

  const getStatusContent = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' }
      case 'completed':
        return { icon: CheckCircle2, className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' }
      case 'rejected':
        return { icon: XCircle, className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' }
      default:
        return { icon: Clock, className: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-400' }
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-zinc-100 dark:border-zinc-800">
            <TableHead className="font-bold text-zinc-400 h-14">Date</TableHead>
            <TableHead className="font-bold text-zinc-400 h-14">Campaign</TableHead>
            <TableHead className="font-bold text-zinc-400 h-14 text-right">Amount</TableHead>
            <TableHead className="font-bold text-zinc-400 h-14 text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.map((w) => {
            const status = getStatusContent(w.status)
            return (
              <TableRow key={w.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 h-16 transition-colors">
                <TableCell className="font-medium text-muted-foreground whitespace-nowrap">
                   {format(new Date(w.created_at), 'dd MMM yyyy')}
                </TableCell>
                <TableCell className="font-bold">
                   {w.fundraiser?.title || 'Unknown'}
                </TableCell>
                <TableCell className="text-right font-black text-lg whitespace-nowrap">
                   {CURRENCY_SYMBOL}{(w.amount / 100).toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                   <Badge className={cn("rounded-full border-none px-3 font-bold uppercase text-[10px] tracking-widest flex items-center gap-1.5 w-fit mx-auto", status.className)}>
                      <status.icon className="h-3 w-3" />
                      {w.status}
                   </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
