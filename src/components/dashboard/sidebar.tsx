'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Heart, 
  Wallet, 
  Settings, 
  PlusCircle, 
  MessageSquare,
  BarChart3,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Heart, label: 'My Fundraisers', href: '/dashboard/fundraisers' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Wallet, label: 'Withdrawals', href: '/dashboard/withdrawals' },
  { icon: MessageSquare, label: 'Comments', href: '/dashboard/comments' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-100 dark:border-zinc-800 w-72 pt-8 pb-6 px-4">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 px-4 mb-10 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 transition-transform group-hover:rotate-6">
          <Heart className="h-6 w-6 fill-current" />
        </div>
        <span className="text-2xl font-black tracking-tighter">Inception</span>
      </Link>

      <div className="space-y-1 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200",
              pathname === item.href 
                ? "bg-primary/10 text-primary shadow-sm" 
                : "text-muted-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="pt-6 mt-6 border-t space-y-4">
        <Button size="lg" className="h-14 w-full rounded-2xl font-black shadow-primary/20 hover:shadow-primary/30 group" asChild>
          <Link href="/fundraisers/create">
            <PlusCircle className="mr-2 h-5 w-5" />
            Start New
          </Link>
        </Button>
        
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-destructive hover:bg-destructive/5 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
