'use client'

import { useCreationStore } from '@/store/use-creation-store'
import { Button } from '@/components/ui/button'
import { SimpleEditor } from '@/components/shared/simple-editor'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'

export function StepStory() {
  const { formData, updateFormData, setStep } = useCreationStore()

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
             <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Tell your story</h2>
        </div>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
          Explain why you're fundraising. Be honest and personal—sharing how people's contributions will help makes a big difference.
        </p>
      </div>

      <div className="space-y-6">
        <SimpleEditor 
          content={formData.story}
          onChange={(content) => updateFormData({ story: content })}
        />
        
        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-dashed">
          <h4 className="font-bold mb-2">Pro Tips:</h4>
          <ul className="text-sm space-y-2 text-muted-foreground list-disc pl-4">
            <li>State exactly what the funds will be used for.</li>
            <li>Break your story into short paragraphs for readability.</li>
            <li>Use bold text for the most important sentences.</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => setStep(1)}
          className="h-14 px-8 rounded-2xl font-bold"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button 
          size="lg" 
          onClick={() => setStep(3)}
          className="h-14 flex-1 text-xl font-black rounded-2xl group"
        >
          Next: Add photos
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  )
}
