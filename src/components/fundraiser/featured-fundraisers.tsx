import { createClient } from '@/lib/supabase/server'
import { FundraiserCard } from './fundraiser-card'
import { Container } from '@/components/shared/container'
import { Flame, Clock, Sparkles } from 'lucide-react'

export async function FeaturedFundraisers() {
  const supabase = createClient()

  // 1. Trending in SA (Strictly donation volume in the last 48 hours)
  // For the MVP, we pull the recruiters with highest raised amount recently
  const { data: trending } = await supabase
    .from('fundraisers')
    .select('*, category:categories(name)')
    .eq('status', 'active')
    .order('donor_count', { ascending: false })
    .limit(3)

  // 2. Ending Soon (Based on a mock end date or proximity to goal)
  const { data: endingSoon } = await supabase
    .from('fundraisers')
    .select('*, category:categories(name)')
    .eq('status', 'active')
    .order('raised_amount', { ascending: false }) // Simplified for MVP
    .limit(3)

  return (
    <div className="py-24 space-y-32">
       {/* Trending Section */}
       <section className="space-y-12">
          <Container>
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                      <Flame className="h-3 w-3 fill-current" />
                      Trending in South Africa
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Most Active Today</h2>
                   <p className="text-muted-foreground text-lg max-w-xl">
                      These campaigns are receiving frequent donations and making a massive impact right now.
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {trending?.map((f) => (
                  <FundraiserCard key={f.id} fundraiser={f} />
                ))}
             </div>
          </Container>
       </section>

       {/* Ending Soon Section */}
       <section className="space-y-12">
          <Container>
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-widest">
                      <Clock className="h-3 w-3" />
                      Almost there
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Help them cross the finish line</h2>
                   <p className="text-muted-foreground text-lg max-w-xl">
                      A small contribution can be the final push these organizers need to reach their goals.
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {endingSoon?.map((f) => (
                  <FundraiserCard key={f.id} fundraiser={f} />
                ))}
             </div>
          </Container>
       </section>
    </div>
  )
}
