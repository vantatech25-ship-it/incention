'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Share2, TrendingUp, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Progress as ShadcnProgress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface FundraiserProgressProps {
  fundraiser: any
}

export function FundraiserProgress({ fundraiser }: FundraiserProgressProps) {
  const percentage = Math.min(Math.round((fundraiser.raised_amount / fundraiser.goal_amount) * 100), 100)
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0,
    }).format(amount / 100)
  }

  return (
    <Card className="sticky top-24 border-none shadow-2xl bg-white dark:bg-zinc-900 overflow-hidden">
      <CardContent className="p-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black">{formatCurrency(fundraiser.raised_amount)}</span>
            <span className="text-muted-foreground font-medium text-lg">raised</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-bold">
               <span className="text-primary">{percentage}% complete</span>
               <span className="text-muted-foreground">Goal: {formatCurrency(fundraiser.goal_amount)}</span>
            </div>
            <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-primary transition-all duration-1000 ease-out" 
                 style={{ width: `${percentage}%` }}
               />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
             <TrendingUp className="h-4 w-4 text-primary" />
             <span>Recent dynamic: High activity in the last 24h</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y">
          <div className="space-y-1">
             <div className="flex items-center gap-1.5 font-black text-xl">
               <Users className="h-5 w-5 text-primary" />
               {fundraiser.donor_count}
             </div>
             <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Donations</p>
          </div>
          <div className="space-y-1 text-right">
             <div className="flex items-center justify-end gap-1.5 font-black text-xl">
               <Share2 className="h-5 w-5 text-primary" />
               842
             </div>
             <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Shares</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button size="lg" className="h-16 w-full text-xl font-black rounded-2xl shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all" asChild>
            <Link href={`/fundraisers/${fundraiser.slug}/donate`}>
              Donate now
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" className="h-12 w-full rounded-xl border-2 font-bold group">
            <Share2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Share fundraiser
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-dashed">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <span>Inception Guarantee: 100% Safe & Verified</span>
        </div>
      </CardContent>
    </Card>
  )
}
