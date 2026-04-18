import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Rocket, Calendar } from 'lucide-react'
import Image from 'next/image'

interface Update {
  id: string
  title: string
  content: string
  image_url?: string
  created_at: string
}

interface UpdatesTimelineProps {
  updates: Update[]
}

export function UpdatesTimeline({ updates }: UpdatesTimelineProps) {
  if (updates.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-dashed">
        <Rocket className="h-12 w-12 text-zinc-300 mx-auto" />
        <div className="space-y-1">
           <p className="font-bold text-lg">No updates yet</p>
           <p className="text-sm text-muted-foreground">The organizer will share progress as the campaign develops.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-transparent">
      {updates.map((update, idx) => (
        <div key={update.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group animate-in slide-in-from-bottom-8 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
          
          {/* Dot */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-zinc-900 bg-primary text-white shadow shadow-primary/30 absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
            <Rocket className="h-5 w-5" />
          </div>

          {/* Content Card */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 md:p-1">
            <Card className="border-none shadow-2xl shadow-black/5 rounded-[2rem] overflow-hidden bg-white dark:bg-zinc-950">
               {update.image_url && (
                 <div className="relative aspect-video">
                    <Image src={update.image_url} alt={update.title} fill className="object-cover" />
                 </div>
               )}
               <CardContent className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-primary">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">
                           {format(new Date(update.created_at), 'dd MMM yyyy')}
                        </span>
                     </div>
                     {idx === 0 && (
                       <Badge className="bg-emerald-500 text-white border-none uppercase text-[10px] font-black tracking-widest">Latest Update</Badge>
                     )}
                  </div>
                  
                  <h3 className="text-2xl font-black tracking-tighter leading-tight group-hover:text-primary transition-colors">
                     {update.title}
                  </h3>
                  
                  <div 
                    className="prose prose-zinc dark:prose-invert max-w-none prose-p:text-sm prose-p:leading-relaxed prose-p:text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: update.content }}
                  />
               </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  )
}
