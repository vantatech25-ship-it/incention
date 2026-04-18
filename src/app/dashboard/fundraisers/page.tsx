import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, ExternalLink, Settings } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function MyFundraisersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: fundraisers } = await supabase
    .from('fundraisers')
    .select('*, category:categories(name)')
    .eq('organizer_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10 px-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight">My Fundraisers</h1>
        <Button size="lg" className="rounded-2xl font-bold h-12" asChild>
          <Link href="/fundraisers/create">Create New</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {fundraisers && fundraisers.length > 0 ? (
          fundraisers.map((f) => (
            <Card key={f.id} className="border-none shadow-xl shadow-black/[0.03] rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 group">
              <CardContent className="p-0 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x dark:divide-zinc-800">
                <div className="w-full md:w-48 aspect-video md:aspect-square relative flex-shrink-0">
                  <Image src={f.cover_image_url} alt={f.title} fill className="object-cover" />
                </div>
                
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="bg-primary/5 text-primary">
                        {f.category?.name}
                      </Badge>
                      <Badge className={f.status === 'active' ? 'bg-green-500' : 'bg-zinc-500'}>
                        {f.status}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold line-clamp-1">{f.title}</h3>
                  </div>

                  <div className="flex items-center gap-6 pt-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Raised</p>
                      <p className="font-black text-lg">${(f.raised_amount / 100).toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Goal</p>
                      <p className="font-bold text-zinc-400">${(f.goal_amount / 100).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-row md:flex-col justify-center gap-3">
                   <Button variant="outline" className="h-12 w-full rounded-xl font-bold border-2" asChild>
                      <Link href={`/fundraisers/${f.slug}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Page
                      </Link>
                   </Button>
                   <Button className="h-12 w-full rounded-xl font-bold" variant="secondary">
                      <Settings className="mr-2 h-4 w-4" />
                      Manage
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-32 text-center space-y-6 bg-white dark:bg-zinc-900 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
             <div className="mx-auto w-24 h-24 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-300">
                <Heart className="h-12 w-12" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-bold">No fundraisers yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You haven't created any fundraisers yet. Start one today and make an impact.
                </p>
             </div>
             <Button size="lg" className="rounded-2xl font-bold h-14 px-10" asChild>
                <Link href="/fundraisers/create">Let's get started</Link>
             </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function Heart(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}
