'use client'

import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/use-debounce'

export function SearchBar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [value, setValue] = useState(searchParams.get('q')?.toString() || '')
  const debouncedValue = useDebounce(value, 300)

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedValue) {
      params.set('q', debouncedValue)
    } else {
      params.delete('q')
    }
    replace(`${pathname}?${params.toString()}`)
  }, [debouncedValue, pathname, replace, searchParams])

  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search fundraisers by title, story, or category..."
        className="h-12 pl-12 pr-12 rounded-full border-2 focus:ring-primary/20 transition-all bg-white dark:bg-zinc-900 shadow-sm"
      />
      {value && (
        <button 
          onClick={() => setValue('')}
          className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
