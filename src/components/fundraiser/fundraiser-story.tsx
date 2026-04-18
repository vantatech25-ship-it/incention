import { Separator } from '@/components/ui/separator'

interface FundraiserStoryProps {
  story: string
}

export function FundraiserStory({ story }: FundraiserStoryProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h3 className="text-2xl font-bold tracking-tight whitespace-nowrap">The Story</h3>
        <Separator className="bg-primary/10" />
      </div>
      
      {/* 
        Tailwind Prose (Typography) for rich text rendering.
        Note: We use prose-zinc and primary color for links.
      */}
      <div 
        className="prose prose-zinc dark:prose-invert max-w-none 
          prose-headings:font-black prose-headings:tracking-tighter 
          prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg
          prose-strong:text-foreground prose-strong:font-bold
          prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-[2.5rem] prose-img:border prose-img:shadow-lg"
        dangerouslySetInnerHTML={{ __html: story }}
      />
    </div>
  )
}
