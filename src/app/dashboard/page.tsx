import { Container } from '@/components/shared/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Heart, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatsChart } from '@/components/dashboard/stats-chart'
import { CURRENCY_SYMBOL } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch summary stats
  const { data: fundraisers } = await supabase
    .from('fundraisers')
    .select('raised_amount, donor_count')
    .eq('organizer_id', user?.id)

  const totalRaised = fundraisers?.reduce((acc, curr) => acc + curr.raised_amount, 0) || 0
  const totalDonors = fundraisers?.reduce((acc, curr) => acc + curr.donor_count, 0) || 0
  const activeCampaigns = fundraisers?.length || 0

  const stats = [
    { 
      label: 'Total Raised', 
      value: `${CURRENCY_SYMBOL}${(totalRaised / 100).toLocaleString()}`, 
      icon: Wallet, 
      trend: '+12.5%', 
      isUp: true,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      label: 'Conversion Rate', 
      value: activeCampaigns > 0 ? '4.8%' : '0%', // Simplified metric
      icon: TrendingUp, 
      trend: '+0.5%', 
      isUp: true,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      label: 'Donor Retention', 
      value: '22%', 
      icon: Users, 
      trend: '+2.1%', 
      isUp: true,
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    },
    { 
      label: 'Active Campaigns', 
      value: activeCampaigns, 
      icon: Heart, 
      trend: '+1', 
      isUp: true,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
  ]

  return (
    <Container className="py-12">
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight uppercase italic">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Deep dive into your campaign performance and donor engagement.</p>
          </div>
          <div className="flex gap-4">
             <Button variant="outline" className="rounded-2xl font-bold h-12">
               Download Report
             </Button>
             <Button className="rounded-2xl font-bold h-12 shadow-lg shadow-primary/20" asChild>
                <Link href="/fundraisers/create">
                   <Plus className="mr-2 h-5 w-5" />
                   New Fundraiser
                </Link>
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-none shadow-xl shadow-black/[0.03] rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-900">
               <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                     <div className={cn("p-3 rounded-2xl", stat.bg)}>
                        <stat.icon className={cn("h-6 w-6", stat.color)} />
                     </div>
                     <div className={cn(
                       "flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full",
                       stat.isUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                     )}>
                       {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                       {stat.trend}
                     </div>
                  </div>
                  <div className="space-y-1">
                     <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                     <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                  </div>
               </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8">
              <Card className="border-none shadow-xl shadow-black/[0.03] rounded-[2.5rem] bg-white dark:bg-zinc-900 p-8">
                 <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                       <h3 className="text-xl font-bold">Donations vs. Page Views</h3>
                       <p className="text-xs text-muted-foreground">Track engagement performance over the last 7 days.</p>
                    </div>
                    <select className="text-xs font-bold uppercase tracking-widest bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg px-3 py-2 outline-none">
                       <option>Last 7 Days</option>
                       <option>Last 30 Days</option>
                    </select>
                 </div>
                 <div className="h-[400px] w-full">
                    <StatsChart />
                 </div>
              </Card>
           </div>
           
           <div className="lg:col-span-4 space-y-8">
              <Card className="border-none shadow-xl shadow-black/[0.03] rounded-[2.5rem] bg-primary text-white p-8">
                 <h3 className="text-xl font-bold mb-2">Pro Insight</h3>
                 <p className="text-sm opacity-80 leading-relaxed">
                   Campaigns with weekly updates see a 2.5x increase in <strong>recurring donations</strong>. Post your first update today!
                 </p>
                 <Button variant="secondary" className="w-full mt-6 rounded-xl font-bold" asChild>
                    <Link href="/dashboard/fundraisers">Manage Updates</Link>
                 </Button>
              </Card>
           </div>
        </div>
      </div>
    </Container>
  )
}
