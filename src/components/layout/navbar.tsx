'use client'

import Link from 'next/link'
import { Heart, Search, Menu, X, User, LogOut, Settings, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/shared/container'
import { useAuth } from '@/hooks/use-auth'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled 
        ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b" 
        : "bg-transparent border-transparent"
    )}>
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 transition-transform group-hover:scale-110 active:scale-95">
                <Heart className="h-6 w-6 fill-current" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-foreground hidden sm:block">Inception</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/fundraisers" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Search
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                How it works
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/fundraisers" className="hidden sm:flex items-center gap-2 md:hidden">
               <Search className="h-5 w-5 text-muted-foreground" />
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-primary/10 transition-transform hover:scale-105">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                        <AvatarFallback className="bg-primary/5 text-primary">
                          {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal border-b pb-4">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">{user.user_metadata?.full_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    render={
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    }
                  />
                  <DropdownMenuItem
                    render={
                      <Link href="/dashboard/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    }
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <Button variant="ghost" asChild className="hidden sm:inline-flex">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild className="rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all">
                  <Link href="/signup">Start a fundraiser</Link>
                </Button>
              </div>
            )}

            <button 
              className="inline-flex items-center justify-center p-2 rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/5 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-in slide-in-from-top-2 duration-300">
          <div className="bg-background border-b px-4 py-6 space-y-4">
            <Link 
              href="/fundraisers" 
              className="block text-lg font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Search fundraiser
            </Link>
            <Link 
              href="/how-it-works" 
              className="block text-lg font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How it works
            </Link>
            {!user && (
              <div className="pt-4 flex flex-col gap-3">
                <Button variant="outline" asChild className="w-full h-12 rounded-xl">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign in</Link>
                </Button>
                <Button asChild className="w-full h-12 rounded-xl">
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>Start a fundraiser</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
