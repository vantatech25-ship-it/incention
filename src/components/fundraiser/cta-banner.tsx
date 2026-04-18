import { Container } from '@/components/shared/container'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTABanner() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[40%] h-full bg-white/10 -skew-x-12 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[30%] h-full bg-black/10 skew-x-12 -translate-x-1/2" />
      
      <Container className="relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-bold backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Ready to make a difference?
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter">
            Every impact starts <br className="hidden md:block" /> with a single step.
          </h2>
          
          <p className="text-primary-foreground/90 text-lg md:text-xl max-w-xl mx-auto">
            Join the community that helps thousands of people every day. Start your fundraiser in just a few minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group" asChild>
              <Link href="/signup">
                Start a fundraiser
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="h-14 px-10 text-lg font-bold rounded-full text-white hover:bg-white/10" asChild>
              <Link href="/how-it-works">Learn more</Link>
            </Button>
          </div>
          
          <p className="text-primary-foreground/70 text-sm font-medium">
            Over $2B+ raised internationally through Inception.
          </p>
        </div>
      </Container>
    </section>
  )
}
