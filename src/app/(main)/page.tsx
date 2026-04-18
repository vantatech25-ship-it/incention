import { createClient } from '@/lib/supabase/server'
import { Container } from '@/components/shared/container'
import { Button } from '@/components/ui/button'
import { CategorySection } from '@/components/fundraiser/category-section'
import { FeaturedFundraisers } from '@/components/fundraiser/featured-fundraisers'
import { HowItWorks } from '@/components/fundraiser/how-it-works'
import { CTABanner } from '@/components/fundraiser/cta-banner'
import { Heart, Globe, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden bg-white dark:bg-black">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary/5 to-transparent -z-10 blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full -z-10 blur-3xl" />
        
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Hero Left */}
            <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">South Africa's #1 Crowdfunding Platform</span>
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                Impact starts <br />
                <span className="text-primary">with action.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                Fundraise for medical expenses, education, or community projects. Secure, local, and built for South African impact.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <Button size="lg" className="h-16 px-10 rounded-[2rem] text-xl font-black shadow-2xl shadow-primary/30 group" asChild>
                  <Link href="/signup">
                    Start an Inception
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10 rounded-[2rem] text-xl font-bold border-2" asChild>
                  <Link href="/how-it-works">How it works</Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-8 pt-10 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Free starting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Mobile optimized</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Hero Right - High Quality Visual */}
            <div className="lg:col-span-5 relative hidden lg:block animate-in fade-in zoom-in-95 duration-1000 delay-200">
              <div className="relative aspect-[4/5] rounded-[2.5rem] bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent border border-primary/10 overflow-hidden shadow-2xl relative">
                {/* Visualizing a warm, emotional image area */}
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center flex-col gap-6">
                   <div className="w-24 h-24 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl flex items-center justify-center">
                      <Heart className="h-12 w-12 text-primary fill-primary/20" />
                   </div>
                   <div className="space-y-2">
                      <div className="h-4 w-48 bg-primary/20 rounded-full mx-auto" />
                      <div className="h-4 w-32 bg-primary/10 rounded-full mx-auto" />
                   </div>
                   <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-primary" />
                   </div>
                   <p className="font-bold text-2xl">R145,000 raised</p>
                </div>
              </div>
              
              {/* Floating Stat Card */}
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-zinc-950 p-6 rounded-3xl shadow-2xl shadow-black/10 border transform -rotate-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Active in</p>
                    <p className="font-bold">South Africa</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-12 -right-8 p-4 rounded-2xl bg-white dark:bg-zinc-900 border shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Payment</p>
                    <p className="font-bold">100% Secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-900/30 border-y">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <p className="text-4xl font-extrabold text-primary">R2.4M+</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Raised</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl font-extrabold text-primary">12k+</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Local Donors</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl font-extrabold text-primary">850+</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Fundraisers</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl font-extrabold text-primary">0%</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Platform Fee</p>
            </div>
          </div>
        </Container>
      </section>

      <FeaturedFundraisers />

      <CategorySection />

      <HowItWorks />

      <CTABanner />
    </div>
  )
}
