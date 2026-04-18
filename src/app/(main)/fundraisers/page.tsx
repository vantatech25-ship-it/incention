import { Container } from '@/components/shared/container'
import { SearchBar } from '@/components/shared/search-bar'
import { CategoryFilter } from '@/components/shared/category-filter'
import { FundraiserCard } from '@/components/fundraiser/fundraiser-card'
import { createClient } from '@/lib/supabase/server'
import { Heart, SearchX } from 'lucide-react'
import { Suspense } from 'react'

interface FundraisersPageProps {
  searchParams: {
    q?: string
    category?: string
    sort?: string
  }
}

export default async function FundraisersPage({ searchParams }: FundraisersPageProps) {
  const query = (await searchParams).q || ''
  const category = (await searchParams).category || ''
  
  const supabase = createClient()
  
  // Real fetch from Supabase
  let dbQuery = supabase
    .from('fundraisers')
    .select('*, organizer:profiles(full_name), category:categories(name, slug)')
    .eq('status', 'active')

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,story.ilike.%${query}%`)
  }

  if (category && category !== 'all') {
    // Note: This requires a join filter or fetching category separately
    // For now, assume we're filtering on category slug via a join
    dbQuery = dbQuery.filter('category.slug', 'eq', category)
  }

  const { data: fundraisers, error } = await dbQuery.order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#FAFBFC] dark:bg-black pt-12 pb-24">
      <Container>
        <div className="flex flex-col space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Browse fundraisers</h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Support a cause you care about. Every small contribution makes a huge difference in someone's life.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Heart className="h-6 w-6 fill-primary" />
            </div>
          </div>

          {/* Filters Bar */}
          <div className="sticky top-[80px] z-30 flex flex-col gap-6 py-6 border-y bg-[#FAFBFC]/80 dark:bg-black/80 backdrop-blur-md">
             <div className="flex flex-col lg:flex-row gap-6 justify-between lg:items-center">
                <Suspense fallback={<div className="h-12 w-full animate-pulse bg-zinc-100 rounded-xl" />}>
                  <SearchBar />
                </Suspense>
                <Suspense fallback={<div className="h-12 w-48 animate-pulse bg-zinc-100 rounded-xl" />}>
                  <CategoryFilter />
                </Suspense>
             </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                {fundraisers?.length || 0} relative fundraiser{fundraisers?.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {fundraisers && fundraisers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {fundraisers.map((fundraiser: any) => (
                  <FundraiserCard 
                    key={fundraiser.id} 
                    fundraiser={{
                      ...fundraiser,
                      organizer_name: fundraiser.organizer?.full_name || 'Organizer',
                      category: fundraiser.category || { name: 'Other', slug: 'other' }
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                  <SearchX className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight">No fundraisers found</h3>
                  <p className="text-muted-foreground max-w-sm">
                    We couldn't find any results match your current search and filters. Try adjusting your query or category.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
