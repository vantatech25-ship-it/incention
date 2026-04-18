import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Container } from '@/components/shared/container'
import { DonationForm } from './donation-form'
import { Heart, ShieldCheck, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface DonatePageProps {
  params: {
    slug: string
  }
}

export default async function DonatePage({ params }: DonatePageProps) {
  const supabase = createClient()
  
  const { data: fundraiser, error } = await supabase
    .from('fundraisers')
    .select('*, organizer:profiles(full_name)')
    .eq('slug', params.slug)
    .single()

  if (error || !fundraiser) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-black py-12 md:py-20">
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link 
            href={`/fundraisers/${fundraiser.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-12 group"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to campaign
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Form Side (7/12) */}
            <div className="lg:col-span-7 space-y-12">
               <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                    <Heart className="h-3 w-3 fill-current" />
                    You're making an impact
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                    Support this <br />
                    meaningful cause
                  </h1>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                    100% of your donation is securely handled by Stripe. Every contribution helps {fundraiser.organizer?.full_name} reach their goal.
                  </p>
               </div>

               <DonationForm fundraiser={fundraiser} />
            </div>

            {/* Campaign Summary Side (5/12) */}
            <aside className="lg:col-span-5 space-y-8">
              <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl shadow-black/5 border border-zinc-100 dark:border-zinc-800 space-y-6">
                <div className="relative aspect-video rounded-2xl overflow-hidden border">
                  <Image 
                    src={fundraiser.cover_image_url} 
                    alt={fundraiser.title} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-bold text-xl leading-snug">{fundraiser.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                      {fundraiser.organizer?.full_name?.charAt(0)}
                    </div>
                    <span>Organized by <span className="text-foreground font-bold">{fundraiser.organizer?.full_name}</span></span>
                  </div>
                </div>

                <div className="pt-6 border-t flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                       <ShieldCheck className="h-3 w-3 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Secure Payment</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Your credit card information is encrypted and never stored on our servers.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                       <Heart className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Inception Verified</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">This campaign has been reviewed by our team for safety and authenticity.</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </div>
  )
}
