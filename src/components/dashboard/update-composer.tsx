'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SimpleEditor } from '@/components/shared/simple-editor'
import { 
  Rocket, 
  Loader2, 
  CheckCircle2, 
  ArrowLeft,
  ImagePlus,
  X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'

interface UpdateComposerProps {
  fundraiserId: string
  fundraiserSlug: string
}

export function UpdateComposer({ fundraiserId, fundraiserSlug }: UpdateComposerProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `updates/${fileName}`

      const { error } = await supabase.storage
        .from('fundraisers')
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('fundraisers')
        .getPublicUrl(filePath)

      setImageUrl(publicUrl)
      toast.success("Update photo uploaded")
    } catch (error: any) {
      toast.error("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handlePublish = async () => {
    if (!title || !content) {
      toast.error("Please provide a title and update content")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('fundraiser_updates')
        .insert([{
          fundraiser_id: fundraiserId,
          title,
          content,
          image_url: imageUrl
        }])

      if (error) throw error

      setSuccess(true)
      toast.success("Update posted successfully!")
      
      // Notify donors logic (Simulated here, would usually use a DB Edge Function or Webhook)
      console.log("Triggering email notifications to donors for fundraiser:", fundraiserId)

      setTimeout(() => {
        router.push(`/fundraisers/${fundraiserSlug}`)
      }, 2000)

    } catch (error: any) {
      toast.error(error.message || "Failed to post update")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
           <CheckCircle2 className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black">Update Published!</h2>
          <p className="text-muted-foreground">Your supporters have been notified of your progress.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
           <Rocket className="h-6 w-6" />
        </div>
        <div className="space-y-0.5">
           <h2 className="text-2xl font-bold">Post a new update</h2>
           <p className="text-sm text-muted-foreground">Share progress, photos, and gratitude with your donors.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
           <Label htmlFor="title" className="font-bold">Summary Title</Label>
           <Input 
             id="title"
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             placeholder="e.g. Surgery was successful!"
             className="h-12 rounded-xl text-lg px-4"
           />
        </div>

        <div className="space-y-2">
           <Label className="font-bold">The Details</Label>
           <SimpleEditor 
             content={content}
             onChange={setContent}
           />
        </div>

        <div className="space-y-4">
           <Label className="font-bold">Add a photo (Optional)</Label>
           {imageUrl ? (
             <div className="relative aspect-video rounded-2xl overflow-hidden border">
                <Image src={imageUrl} alt="Update" fill className="object-cover" />
                <button 
                  onClick={() => setImageUrl('')}
                  className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                   <X className="h-4 w-4" />
                </button>
             </div>
           ) : (
             <div className="relative aspect-video rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center group hover:border-primary/50 transition-all cursor-pointer">
                {uploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : (
                  <>
                    <ImagePlus className="h-10 w-10 text-zinc-300 group-hover:text-primary transition-colors" />
                    <span className="mt-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">Upload Photo</span>
                  </>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
             </div>
           )}
        </div>
      </div>

      <div className="pt-6 flex gap-4">
         <Button 
           variant="outline" 
           className="h-14 px-8 rounded-2xl font-bold"
           asChild
         >
           <button onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
           </button>
         </Button>
         <Button 
           size="lg" 
           onClick={handlePublish}
           disabled={loading}
           className="h-14 flex-1 text-xl font-black rounded-2xl shadow-xl shadow-primary/20"
         >
           {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Rocket className="mr-2 h-5 w-5" />}
           {loading ? 'Publishing...' : 'Publish Update'}
         </Button>
      </div>
    </div>
  )
}
