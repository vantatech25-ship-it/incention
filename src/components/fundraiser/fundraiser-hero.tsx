import { Container } from '@/components/shared/container'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Share2, MapPin, Calendar, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface FundraiserHeroProps {
  fundraiser: any
}

export function FundraiserHero({ fundraiser }: FundraiserHeroProps) {
  return (
    <div className="relative pt-8 pb-12">
      <Container>
        <div className="flex flex-col gap-8">
          {/* Top Navigation */}
          <div className="flex items-center justify-between">
            <Link 
              href="/fundraisers" 
              className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary group"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to search
            </Link>
            <div className="flex items-center gap-2">
               <Badge variant="secondary" className="px-3 py-1 font-bold bg-primary/5 text-primary border-primary/10">
                 {fundraiser.category?.name}
               </Badge>
               {fundraiser.is_featured && (
                 <Badge className="bg-amber-500 hover:bg-amber-600 border-none font-bold">
                   Featured
                 </Badge>
               )}
            </div>
          </div>

          {/* Title and Meta */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight text-balance">
              {fundraiser.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 border overflow-hidden">
                   {/* Organizer Avatar placeholder */}
                   <span className="text-primary font-bold">
                     {fundraiser.organizer?.full_name?.charAt(0)}
                   </span>
                </div>
                <span>
                  By <span className="text-foreground font-bold">{fundraiser.organizer?.full_name}</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{fundraiser.location || 'Global/Online'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Started {new Date(fundraiser.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
