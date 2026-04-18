'use client'

import { useState } from 'react'
import { signup, signInWithGoogle } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const result = await signup(formData)

    if (result?.error) {
      toast.error(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      setIsSuccess(true)
      setIsLoading(false)
      toast.success("Check your email to verify your account")
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full border-none shadow-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
        <CardDescription className="text-lg">
          We've sent a verification link to your email address. Please click the link to confirm your account.
        </CardDescription>
        <Button variant="outline" onClick={() => setIsSuccess(false)} className="mt-4">
          Back to signup
        </Button>
      </Card>
    )
  }

  return (
    <Card className="w-full border-none shadow-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Join Inception and start making an impact today
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
            Sign up with Google
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
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              required
              className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>
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
            <Label htmlFor="password">Password</Label>
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
            Create Account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-center gap-2">
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
