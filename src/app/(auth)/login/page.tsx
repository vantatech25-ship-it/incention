import { LoginForm } from './login-form'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#FAFBFC] dark:bg-[#0A0A0B]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
      
      <div className="container relative z-10 flex flex-col items-center px-4 sm:px-6">
        <Link 
          href="/" 
          className="mb-8 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-foreground">Inception</span>
        </Link>
        
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <LoginForm />
        </div>
        
        <p className="mt-8 text-center text-sm text-muted-foreground max-w-xs">
          By continuing, you agree to Inception's{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">Terms of Service</Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
