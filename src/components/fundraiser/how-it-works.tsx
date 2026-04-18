import { Container } from '@/components/shared/container'
import { PlusCircle, Share2, HeartHandshake, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const steps = [
  {
    title: "Create your fundraiser",
    description: "Tell your story, set your goal, and add photos or videos to bring your cause to life. It takes just minutes.",
    icon: PlusCircle,
    color: "bg-blue-500",
    shadow: "shadow-blue-500/20"
  },
  {
    title: "Share with the world",
    description: "Use our built-in tools to share your fundraiser via email, social media, and text. Spreading the word is key.",
    icon: Share2,
    color: "bg-purple-500",
    shadow: "shadow-purple-500/20"
  },
  {
    title: "Receive donations",
    description: "Donations are processed securely and sent directly to you or your beneficiary. Start making an impact immediately.",
    icon: HeartHandshake,
    color: "bg-emerald-500",
    shadow: "shadow-emerald-500/20"
  }
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-zinc-950 overflow-hidden">
      <Container>
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">How Inception works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Starting a fundraiser on Inception is simple, fast, and secure. Follow these steps to begin your journey.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-6 group">
                <div className={`w-24 h-24 rounded-[2rem] ${step.color} ${step.shadow} flex items-center justify-center text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl`}>
                  <step.icon className="h-10 w-10" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold tracking-tight">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-[280px]">
                    {step.description}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-xs font-bold text-muted-foreground border">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center gap-6">
          <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-full group" asChild>
             <Link href="/signup">
                Get started today
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
             </Link>
          </Button>
          <p className="text-sm font-medium text-muted-foreground">
            Trusted by over 1 million users worldwide.
          </p>
        </div>
      </Container>
    </section>
  )
}
