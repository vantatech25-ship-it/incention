'use client'

import { Container } from '@/components/shared/container'
import { StepBasics } from '@/components/fundraiser/creation-wizard/step-basics'
import { StepStory } from '@/components/fundraiser/creation-wizard/step-story'
import { StepMedia } from '@/components/fundraiser/creation-wizard/step-media'
import { StepDetails } from '@/components/fundraiser/creation-wizard/step-details'
import { StepReview } from '@/components/fundraiser/creation-wizard/step-review'
import { useCreationStore } from '@/store/use-creation-store'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const steps = [
  { id: 1, title: 'Basics' },
  { id: 2, title: 'Story' },
  { id: 3, title: 'Media' },
  { id: 4, title: 'Details' },
  { id: 5, title: 'Review' },
]

export default function CreateFundraiserPage() {
  const { step } = useCreationStore()

  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-black py-16">
      <Container>
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Post your fundraiser</h1>
            <p className="text-muted-foreground text-lg">Follow these steps to launch your campaign and start receiving help.</p>
          </div>

          {/* Stepper */}
          <div className="relative flex justify-between items-center max-w-2xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 -z-10" />
            
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-3">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
                    step === s.id ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20" : 
                    step > s.id ? "bg-primary border-primary text-white" : 
                    "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground"
                  )}
                >
                  {step > s.id ? <Check className="h-5 w-5" /> : s.id}
                </div>
                <span className={cn(
                  "text-[10px] uppercase font-bold tracking-widest transition-colors",
                  step >= s.id ? "text-primary" : "text-muted-foreground"
                )}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/5 border border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {step === 1 && <StepBasics />}
             {step === 2 && <StepStory />}
             {step === 3 && <StepMedia />}
             {step === 4 && <StepDetails />}
             {step === 5 && <StepReview />}
          </div>
        </div>
      </Container>
    </div>
  )
}
