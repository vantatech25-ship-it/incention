'use client'

import { useState } from 'react'
import { useCreationStore } from '@/store/use-creation-store'
import { Button } from '@/components/ui/button'
import { ImagePlus, X, Image as ImageIcon, CheckCircle2, Loader2, ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export function StepMedia() {
  const { formData, updateFormData, setStep } = useCreationStore()
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { data, error } = await supabase.storage
          .from('fundraisers')
          .upload(filePath, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('fundraisers')
          .getPublicUrl(filePath)

        newUrls.push(publicUrl)
      }

      const allUrls = [...formData.gallery_urls, ...newUrls]
      
      // First image becomes cover if not set
      if (!formData.cover_image_url && allUrls.length > 0) {
        updateFormData({ 
          cover_image_url: allUrls[0],
          gallery_urls: allUrls.slice(1)
        })
      } else {
        updateFormData({ gallery_urls: allUrls })
      }
      
      toast.success(`${newUrls.length} photo(s) uploaded successfully`)
    } catch (error: any) {
      toast.error(error.message || "Error uploading images")
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (url: string, isCover: boolean) => {
    if (isCover) {
      const nextCover = formData.gallery_urls[0] || ''
      updateFormData({ 
        cover_image_url: nextCover,
        gallery_urls: formData.gallery_urls.slice(1)
      })
    } else {
      updateFormData({ 
        gallery_urls: formData.gallery_urls.filter(u => u !== url) 
      })
    }
  }

  const setAsCover = (url: string) => {
    const oldCover = formData.cover_image_url
    const newGallery = [oldCover, ...formData.gallery_urls.filter(u => u !== url)].filter(Boolean)
    updateFormData({
      cover_image_url: url,
      gallery_urls: newGallery
    })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Add photos to your fundraiser</h2>
        <p className="text-muted-foreground text-lg">
          Fundraisers with at least 3 high-quality photos raise 2x more. Show the impact!
        </p>
      </div>

      <div className="space-y-6">
        {/* Main Cover Section */}
        <div className="relative group aspect-[16/9] rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 overflow-hidden flex flex-col items-center justify-center transition-all hover:border-primary/50">
          {formData.cover_image_url ? (
            <>
              <Image src={formData.cover_image_url} alt="Cover" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                 <Button variant="destructive" size="sm" onClick={() => removeImage(formData.cover_image_url, true)}>
                    <X className="h-4 w-4 mr-2" /> Remove
                 </Button>
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-widest">
                Main Cover
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-white dark:bg-zinc-900 border flex items-center justify-center text-muted-foreground shadow-sm">
                 <ImagePlus className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                 <p className="font-bold">Drop your main cover photo</p>
                 <p className="text-xs text-muted-foreground">JPG, PNG or WEBP. Max 5MB.</p>
              </div>
              <input 
                type="file" 
                multiple 
                onChange={handleFileUpload} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                accept="image/*"
                disabled={uploading}
              />
            </div>
          )}
          {uploading && (
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="text-center space-y-4 text-white">
                   <Loader2 className="h-10 w-10 animate-spin mx-auto" />
                   <p className="font-bold">Uploading your impact...</p>
                </div>
             </div>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {formData.gallery_urls.map((url, idx) => (
             <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border bg-zinc-100 dark:bg-zinc-800">
                <Image src={url} alt={`Gallery ${idx}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                   <Button variant="secondary" size="xs" className="text-[10px] h-7 px-2" onClick={() => setAsCover(url)}>
                     Set as Cover
                   </Button>
                   <Button variant="destructive" size="xs" className="h-7 w-7 p-0" onClick={() => removeImage(url, false)}>
                     <X className="h-4 w-4" />
                   </Button>
                </div>
             </div>
           ))}
           
           {(formData.cover_image_url || formData.gallery_urls.length > 0) && (
             <div className="relative aspect-square rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
                <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Add More</span>
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileUpload} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept="image/*"
                  disabled={uploading}
                />
             </div>
           )}
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => setStep(2)}
          className="h-14 px-8 rounded-2xl font-bold"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button 
          size="lg" 
          onClick={() => setStep(4)}
          className="h-14 flex-1 text-xl font-black rounded-2xl group"
          disabled={!formData.cover_image_url}
        >
          Next: Final details
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  )
}
