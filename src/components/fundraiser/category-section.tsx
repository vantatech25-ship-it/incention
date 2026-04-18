import Link from 'next/link'
import { Stethoscope, AlertTriangle, GraduationCap, Dog, Users, Palette, Trophy, Sparkles } from 'lucide-react'
import { Container } from '@/components/shared/container'

const categories = [
  { name: 'Medical', icon: Stethoscope, slug: 'medical', color: 'bg-blue-500' },
  { name: 'Emergency', icon: AlertTriangle, slug: 'emergency', color: 'bg-red-500' },
  { name: 'Education', icon: GraduationCap, slug: 'education', color: 'bg-amber-500' },
  { name: 'Animals', icon: Dog, slug: 'animals', color: 'bg-green-500' },
  { name: 'Community', icon: Users, slug: 'community', color: 'bg-indigo-500' },
  { name: 'Creative', icon: Palette, slug: 'creative', color: 'bg-pink-500' },
  { name: 'Sports', icon: Trophy, slug: 'sports', color: 'bg-orange-500' },
  { name: 'Other', icon: Sparkles, slug: 'other', color: 'bg-zinc-500' },
]

export function CategorySection() {
  return (
    <section className="py-24 bg-white dark:bg-[#0A0A0B]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Browse by category</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Whatever your cause, we have a place for it. Explore fundraisers by the topics that matter to you.
            </p>
          </div>
          <Link 
            href="/fundraisers" 
            className="text-primary font-semibold hover:underline flex items-center gap-1 group"
          >
            Show all categories
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link 
              key={category.slug}
              href={`/fundraisers?category=${category.slug}`}
              className="group relative p-6 rounded-3xl border bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-800 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${category.color} flex items-center justify-center text-white shadow-lg shadow-${category.slug}-500/20`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg">{category.name}</h3>
              </div>
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-xl">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
