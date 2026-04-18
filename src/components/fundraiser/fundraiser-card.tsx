import Image from 'next/image'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FundraiserCardProps {
  fundraiser: {
    id: string
    title: string
    slug: string
    category: { name: string, slug: string }
    raised_amount: number
    goal_amount: number
    donor_count: number
    cover_image_url: string
    organizer_name: string
  }
  className?: string
}

export function FundraiserCard({ fundraiser, className }: FundraiserCardProps) {
  const percentage = Math.min(Math.round((fundraiser.raised_amount / fundraiser.goal_amount) * 100), 100)
  const isGoalReached = percentage >= 100

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      maximumFractionDigits: 0,
    }).format(amount / 100)
  }

  return (
    <Link 
      href={`/fundraisers/${fundraiser.slug}`}
      className={cn(
        "group flex flex-col h-full bg-white dark:bg-zinc-900 border rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 active:scale-[0.98]",
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 transition-opacity group-hover:opacity-40" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
            {fundraiser.category.name}
          </span>
        </div>

        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
           {/* Placeholder for real image */}
           <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 animate-pulse flex items-center justify-center">
              <Image 
                src={fundraiser.cover_image_url || '/images/placeholder-fundraiser.webp'} 
                alt={fundraiser.title}
                fill
                className="object-cover"
                sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
              />
           </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 space-y-4">
        <div className="space-y-2">
           <h3 className="font-bold text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {fundraiser.title}
           </h3>
           <p className="text-sm text-muted-foreground flex items-center gap-2">
              By <span className="font-semibold text-foreground">{fundraiser.organizer_name}</span>
           </p>
        </div>

        <div className="mt-auto space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-bold">
              <span className="text-primary">{percentage}% raised</span>
              {isGoalReached && <span className="text-green-600 dark:text-green-400">Goal reached!</span>}
            </div>
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
               <div 
                 className={cn(
                   "h-full transition-all duration-1000 ease-out rounded-full",
                   isGoalReached ? "bg-green-500" : "bg-primary"
                 )} 
                 style={{ width: `${percentage}%` }}
               />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
               <p className="text-lg font-black text-foreground">
                 {formatCurrency(fundraiser.raised_amount)}
               </p>
               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">
                 raised of {formatCurrency(fundraiser.goal_amount)}
               </p>
            </div>
            <div className="flex flex-col items-end">
               <div className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {fundraiser.donor_count}
               </div>
               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                 Donors
               </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
