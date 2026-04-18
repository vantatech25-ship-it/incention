'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react'

interface FundraiserGalleryProps {
  images: string[]
}

export function FundraiserGallery({ images = [] }: FundraiserGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)

  if (images.length === 0) return null

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-800 border">
        <Image
          src={images[activeIdx]}
          alt={`Gallery image ${activeIdx + 1}`}
          fill
          className="object-cover animate-in fade-in duration-500"
          priority
        />
        
        {images.length > 1 && (
          <>
            <button 
              onClick={() => setActiveIdx((idx) => (idx === 0 ? images.length - 1 : idx - 1))}
              className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:bg-white/40 dark:hover:bg-black/40"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={() => setActiveIdx((idx) => (idx === images.length - 1 ? 0 : idx + 1))}
              className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:bg-white/40 dark:hover:bg-black/40"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
           {activeIdx + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={cn(
                "relative flex-shrink-0 h-20 w-32 rounded-2xl overflow-hidden border-4 transition-all",
                activeIdx === idx ? "border-primary scale-105 shadow-lg shadow-primary/20" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
