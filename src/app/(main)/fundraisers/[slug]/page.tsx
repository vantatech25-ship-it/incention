import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Container } from '@/components/shared/container'
import { FundraiserHero } from '@/components/fundraiser/fundraiser-hero'
import { FundraiserProgress } from '@/components/fundraiser/fundraiser-progress'
import { FundraiserGallery } from '@/components/fundraiser/fundraiser-gallery'
import { FundraiserStory } from '@/components/fundraiser/fundraiser-story'
import { DonationFeed } from '@/components/fundraiser/donation-feed'
import { UpdatesTimeline } from '@/components/fundraiser/updates-timeline'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface FundraiserPageProps {
  params: {
    slug: string
  }
}

export default async function FundraiserDetailPage({ params }: FundraiserPageProps) {
  const supabase = createClient()
  
  const { data: fundraiser, error } = await supabase
    .from('fundraisers')
    .select('*, organizer:profiles(full_name), category:categories(name, slug)')
    .eq('slug', params.slug)
    .single()

  if (error || !fundraiser) {
    notFound()
  }

  // Fetch initial donations
  const { data: initialDonations } = await supabase
    .from('donations')
    .select('*')
    .eq('fundraiser_id', fundraiser.id)
    .eq('status', 'succeeded')
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch updates
  const { data: updates } = await supabase
    .from('fundraiser_updates')
    .select('*')
    .eq('fundraiser_id', fundraiser.id)
    .order('created_at', { ascending: false })

  return (
    <div className="bg-[#FAFBFC] dark:bg-black min-h-screen">
      {/* Hero Section */}
      <FundraiserHero fundraiser={fundraiser} />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-24">
          
          {/* Main Content Area (8/12) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Gallery */}
            <FundraiserGallery 
              images={[
                fundraiser.cover_image_url, 
                ...(fundraiser.gallery_urls || [])
              ].filter(Boolean)} 
            />

            {/* Campaign Content Tabs */}
            <div className="space-y-8">
              <Tabs defaultValue="story" className="w-full">
                <TabsList className="w-full justify-start h-14 bg-transparent border-b rounded-none p-0 gap-8">
                  <TabsTrigger 
                    value="story" 
                    className="h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 font-bold text-lg"
                  >
                    Campaign Story
                  </TabsTrigger>
                  <TabsTrigger 
                    value="updates" 
                    className="h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 font-bold text-lg"
                  >
                    Updates
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] text-muted-foreground">
                      {updates?.length || 0}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="donations" 
                    className="h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 font-bold text-lg"
                  >
                    Recent Activity
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] text-muted-foreground">
                      {fundraiser.donor_count}
                    </span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="pt-8">
                  <TabsContent value="story" className="m-0 focus-visible:ring-0">
                    <FundraiserStory story={fundraiser.story} />
                  </TabsContent>
                  
                  <TabsContent value="updates" className="m-0 focus-visible:ring-0">
                    <UpdatesTimeline updates={updates || []} />
                  </TabsContent>

                  <TabsContent value="donations" className="m-0 focus-visible:ring-0">
                    <DonationFeed 
                      fundraiserId={fundraiser.id} 
                      initialDonations={initialDonations || []} 
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Sidebar Area (4/12) */}
          <aside className="lg:col-span-4 relative">
             <FundraiserProgress fundraiser={fundraiser} />
          </aside>
          
        </div>
      </Container>
    </div>
  )
}
