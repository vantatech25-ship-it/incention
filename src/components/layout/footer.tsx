import Link from 'next/link'
import { Heart, Globe, MessageSquare, Video, Mail } from 'lucide-react'
import { Container } from '@/components/shared/container'

const footerLinks = [
  {
    title: "Fundraise for",
    links: [
      { label: "Medical", href: "/fundraisers?category=medical" },
      { label: "Emergency", href: "/fundraisers?category=emergency" },
      { label: "Education", href: "/fundraisers?category=education" },
      { label: "Animals", href: "/fundraisers?category=animals" },
      { label: "Community", href: "/fundraisers?category=community" },
    ]
  },
  {
    title: "Learn more",
    links: [
      { label: "How Inception works", href: "/how-it-works" },
      { label: "Why Inception?", href: "/why-us" },
      { label: "Success stories", href: "/stories" },
      { label: "Supported countries", href: "/countries" },
      { label: "Charity fundraising", href: "/charity" },
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Blog", href: "/blog" },
      { label: "GoFundMe vs Inception", href: "/compare" },
      { label: "Pricing", href: "/pricing" },
      { label: "Safety", href: "/safety" },
    ]
  }
]

export function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900/30 border-t">
      <Container className="py-12 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="col-span-2 lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white transition-transform group-hover:scale-110 active:scale-95">
                <Heart className="h-6 w-6 fill-current" />
              </div>
              <span className="text-2xl font-bold tracking-tighter">Inception</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              The leading crowdfunding platform, helping people since 2026. Join us in making a difference, one fundraiser at a time.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 rounded-full bg-background border transition-colors hover:bg-primary hover:text-white" aria-label="Globe">
                <Globe className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-background border transition-colors hover:bg-primary hover:text-white" aria-label="Message">
                <MessageSquare className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-background border transition-colors hover:bg-primary hover:text-white" aria-label="Video">
                <Video className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-background border transition-colors hover:bg-primary hover:text-white" aria-label="Email">
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {footerLinks.map((section) => (
             <div key={section.title} className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-wider">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-muted-foreground text-sm transition-colors hover:text-primary">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
             </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground">
            © 2026 Inception, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/terms" className="hover:text-primary">Terms</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy</Link>
            <Link href="/cookies" className="hover:text-primary">Cookies</Link>
            <Link href="/accessibility" className="hover:text-primary">Accessibility</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
