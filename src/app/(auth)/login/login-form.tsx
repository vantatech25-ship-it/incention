'use client'

import { useState } from 'react'
import { login, signInWithGoogle } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await login(formData)

    if (result?.error) {
      toast.error(result.error)
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full border-none shadow-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your email to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 gap-6">
          <Button 
            variant="outline" 
            type="button" 
            disabled={isLoading || isGoogleLoading}
            onClick={async () => {
              setIsGoogleLoading(true)
              const result = await signInWithGoogle()
              if (result?.error) {
                toast.error(result.error)
                setIsGoogleLoading(false)
              }
            }}
            className="w-full h-11 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Globe className="mr-2 h-4 w-4" />
            )}
            Continue with Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button disabled={isLoading || isGoogleLoading} type="submit" className="w-full h-11 font-semibold text-lg transition-all active:scale-[0.98]">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-center gap-2">
        <div className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
