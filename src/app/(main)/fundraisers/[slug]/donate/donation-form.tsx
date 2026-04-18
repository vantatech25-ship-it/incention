'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { CURRENCY_SYMBOL } from '@/lib/constants'
import { createCheckoutSession } from './actions'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const presets = [10, 25, 50, 100, 250, 500]

export function DonationForm({ fundraiser }: { fundraiser: any }) {
  const [amount, setAmount] = useState<number>(25)
  const [isCustom, setIsCustom] = useState(false)
  const [donorName, setDonorName] = useState('')
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (amount < 1) {
      toast.error("Minimum donation amount is $1")
      setIsLoading(false)
      return
    }

    try {
      const result = await createCheckoutSession({
        fundraiserId: fundraiser.id,
        slug: fundraiser.slug,
        amount: amount * 100, // Convert to cents
        donorName: isAnonymous ? 'Anonymous' : donorName,
        message,
        isAnonymous
      })

      if (result?.url) {
        window.location.href = result.url
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Amount Selection */}
      <div className="space-y-6">
        <Label className="text-xl font-black">Choose an amount</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setAmount(preset)
                setIsCustom(false)
              }}
              className={cn(
                "h-16 rounded-2xl border-2 font-black text-xl transition-all active:scale-[0.98]",
                amount === preset && !isCustom
                  ? "bg-primary border-primary text-white shadow-xl shadow-primary/25"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-primary/50"
              )}
            >
              {CURRENCY_SYMBOL}{preset}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsCustom(true)}
            className={cn(
               "h-16 rounded-2xl border-2 font-black text-xl transition-all active:scale-[0.98]",
               isCustom
                 ? "bg-primary border-primary text-white shadow-xl shadow-primary/25"
                 : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-primary/50"
             )}
          >
            Custom
          </button>
        </div>

        {isCustom && (
          <div className="relative animate-in zoom-in-95 duration-200">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <span className="text-xl font-black text-zinc-400">{CURRENCY_SYMBOL}</span>
            </div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter custom amount"
              className="h-16 pl-14 pr-8 text-2xl font-black rounded-2xl border-zinc-200 dark:border-zinc-800 focus:ring-primary/20"
              min="1"
            />
          </div>
        )}
      </div>

      <div className="space-y-8">
        <Label className="text-xl font-black">Leave a message (Optional)</Label>
        <div className="space-y-4">
           <div className="space-y-2">
              <Label htmlFor="donorName" className="font-bold">Your Name</Label>
              <Input 
                id="donorName"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="How should we call you?"
                className="h-12 rounded-xl"
                disabled={isAnonymous}
              />
           </div>
           <div className="space-y-2">
              <Label htmlFor="message" className="font-bold">Words of support</Label>
              <Textarea 
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave a kind word for the organizer..."
                className="min-h-[120px] rounded-xl pt-4"
              />
           </div>
           <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-dashed">
              <div className="space-y-0.5">
                <Label htmlFor="anonymous" className="font-bold cursor-pointer">Post anonymously</Label>
                <p className="text-xs text-muted-foreground">Donors won't see your name on the feed.</p>
              </div>
              <Switch 
                id="anonymous" 
                checked={isAnonymous} 
                onCheckedChange={setIsAnonymous} 
              />
           </div>
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="h-18 w-full text-2xl font-black rounded-[2rem] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all group p-8"
        >
          {isLoading ? (
            <Loader2 className="mr-3 h-8 w-8 animate-spin" />
          ) : (
            <Sparkles className="mr-3 h-6 w-6 text-primary-foreground group-hover:animate-pulse" />
          )}
          {isLoading ? 'Processing...' : `Donate ${CURRENCY_SYMBOL}${amount.toLocaleString()} Now`}
          {!isLoading && <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />}
        </Button>
        <p className="text-center mt-6 text-xs text-muted-foreground">
          By donating, you agree to our <Link href="/terms" className="underline">Terms of Service</Link>.
        </p>
      </div>
    </form>
  )
}
