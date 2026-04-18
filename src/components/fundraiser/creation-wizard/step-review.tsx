'use client'

import { useCreationStore } from '@/store/use-creation-store'
import { Button } from '@/components/ui/button'
import { FundraiserCard } from '@/components/fundraiser/fundraiser-card'
import { ArrowLeft, Rocket, Loader2, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function StepReview() {
  const { formData, setStep, reset } = useCreationStore()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handlePublish = async () => {
    setIsPublishing(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("You must be logged in to publish")

      // Slug creation helper
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        + '-' + Math.random().toString(36).substring(2, 7)

      const { data, error } = await supabase
        .from('fundraisers')
        .insert([{
          organizer_id: user.id,
          title: formData.title,
          slug,
          category_id: formData.category_id,
          goal_amount: formData.goal_amount,
          story: formData.story,
          cover_image_url: formData.cover_image_url,
          gallery_urls: formData.gallery_urls,
          beneficiary_name: formData.beneficiary_name,
          beneficiary_relation: formData.beneficiary_relation,
          location: formData.location,
          status: 'active'
        }])
        .select()
        .single()

      if (error) throw error

      setIsSuccess(true)
      toast.success("Congratulations! Your fundraiser is live.")
      
      // Delay redirect to show success state
      setTimeout(() => {
        reset()
        router.push(`/fundraisers/${data.slug}`)
      }, 3000)

    } catch (error: any) {
      toast.error(error.message || "Failed to publish fundraiser")
      console.error(error)
    } finally {
      setIsPublishing(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-700">
        <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
           <CheckCircle2 className="h-16 w-16" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tight">You're making a difference!</h2>
          <p className="text-muted-foreground text-lg max-w-sm">
            Your campaign is live and ready to receive donations. Redirecting you to your page...
          </p>
        </div>
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Ready to launch?</h2>
        <p className="text-muted-foreground text-lg">
          Take a final look at how your fundraiser will appear to donors. You can always edit this later.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Preview Card</h4>
            <div className="max-w-[400px]">
               <FundraiserCard 
                 fundraiser={{
                    ...formData,
                    id: 'preview',
                    slug: '#',
                    donor_count: 0,
                    raised_amount: 0,
                    category: { name: 'Preview', slug: 'preview' },
                    organizer_name: 'You (Preview)'
                 }} 
               />
            </div>
         </div>

         <div className="space-y-8 flex flex-col justify-center">
            <div className="space-y-4">
               <h4 className="font-bold text-xl">Almost there...</h4>
               <p className="text-muted-foreground leading-relaxed">
                 By clicking "Publish Now", you agree to our terms of service and confirm that the information provided is accurate and for a legitimate cause.
               </p>
            </div>

            <div className="flex flex-col gap-4">
               <Button 
                 disabled={isPublishing} 
                 onClick={handlePublish}
                 className="h-16 w-full text-2xl font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
               >
                 {isPublishing ? (
                   <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                 ) : (
                   <Rocket className="mr-3 h-6 w-6" />
                 )}
                 {isPublishing ? 'Launching...' : 'Publish Now'}
               </Button>
               
               <Button 
                 variant="ghost" 
                 disabled={isPublishing}
                 onClick={() => setStep(4)}
                 className="h-12 font-bold"
               >
                 <ArrowLeft className="mr-2 h-4 w-4" />
                 Wait, I need to edit something
               </Button>
            </div>
         </div>
      </div>
    </div>
  )
}
