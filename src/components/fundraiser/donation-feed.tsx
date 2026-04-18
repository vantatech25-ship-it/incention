'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Heart, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface DonationFeedProps {
  fundraiserId: string
  initialDonations?: any[]
}

export function DonationFeed({ fundraiserId, initialDonations = [] }: DonationFeedProps) {
  const [donations, setDonations] = useState<any[]>(initialDonations)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`donations-${fundraiserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'donations',
          filter: `fundraiser_id=eq.${fundraiserId}`,
        },
        (payload) => {
          setDonations((current) => [payload.new, ...current])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fundraiserId, supabase])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0,
    }).format(amount / 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          Recent Donations
          <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-muted-foreground">
             {donations.length}
          </span>
        </h3>
      </div>

      <div className="space-y-4">
        {donations.length > 0 ? (
          donations.map((donation) => (
            <div key={donation.id} className="group relative flex gap-4 p-4 rounded-2xl transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800">
              <Avatar className="h-12 w-12 border-2 border-white dark:border-zinc-900">
                <AvatarImage src={donation.donor_avatar} />
                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                  {donation.donor_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    {donation.donor_name}
                    {donation.is_anonymous && (
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                        Secret
                      </span>
                    )}
                  </h4>
                  <span className="text-sm font-black text-primary">
                    {formatCurrency(donation.amount)}
                  </span>
                </div>
                {donation.message && (
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "{donation.message}"
                  </p>
                )}
                <div className="flex items-center gap-4 pt-1">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                     {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true })}
                   </p>
                   <button className="flex items-center gap-1 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                     <Heart className="h-3 w-3 fill-current" />
                     Like
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center space-y-2 border border-dashed rounded-3xl">
             <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto" />
             <p className="text-sm text-muted-foreground">No donations yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  )
}
