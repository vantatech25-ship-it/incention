'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const categories = [
  { name: 'All', slug: 'all' },
  { name: 'Medical', slug: 'medical' },
  { name: 'Emergency', slug: 'emergency' },
  { name: 'Education', slug: 'education' },
  { name: 'Animals', slug: 'animals' },
  { name: 'Community', slug: 'community' },
  { name: 'Creative', slug: 'creative' },
  { name: 'Sports', slug: 'sports' },
]

export function CategoryFilter() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const currentCategory = searchParams.get('category') || 'all'

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams)
    if (slug === 'all') {
      params.delete('category')
    } else {
      params.set('category', slug)
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {categories.map((category) => (
        <button
          key={category.slug}
          onClick={() => setCategory(category.slug)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold transition-all border",
            currentCategory === category.slug
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
              : "bg-white dark:bg-zinc-900 text-muted-foreground border-zinc-200 dark:border-zinc-800 hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
