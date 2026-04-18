'use client'

import { useEffect, useState } from 'react'
import { useCreationStore } from '@/store/use-creation-store'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-react'
import { CURRENCY_SYMBOL } from '@/lib/constants'
import { toast } from 'sonner'

export function StepBasics() {
  const { formData, updateFormData, setStep } = useCreationStore()
  const [categories, setCategories] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').order('name')
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [supabase])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.goal_amount || !formData.category_id) {
      toast.error("Please fill in all required fields")
      return
    }
    setStep(2)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Let's start with the basics</h2>
        <p className="text-muted-foreground">Give your fundraiser a clear title and set a realistic goal.</p>
      </div>

      <div className="space-y-6 text-left">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-lg font-bold">Fundraiser Title</Label>
          <Input 
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="e.g. Help Sarah with her heart surgery"
            className="h-12 rounded-xl text-lg px-4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <Label htmlFor="goal" className="text-lg font-bold">Your Goal ({CURRENCY_SYMBOL})</Label>
             <div className="relative">
               <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                 <span className="text-lg font-black text-muted-foreground">{CURRENCY_SYMBOL}</span>
               </div>
               <Input 
                 id="goal"
                 type="number"
                 value={formData.goal_amount ? formData.goal_amount / 100 : ''}
                 onChange={(e) => updateFormData({ goal_amount: (Number(e.target.value) * 100) })}
                 placeholder="0"
                 className="h-12 pl-12 rounded-xl text-lg px-4"
               />
             </div>
           </div>

           <div className="space-y-2">
              <Label htmlFor="category" className="text-lg font-bold">Category</Label>
              <select 
                id="category"
                value={formData.category_id}
                onChange={(e) => updateFormData({ category_id: e.target.value })}
                className="w-full h-12 rounded-xl border bg-white dark:bg-zinc-900 px-4 text-lg focus:ring-2 focus:ring-primary/20 appearance-none outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
           </div>
        </div>
      </div>

      <div className="pt-6">
        <Button size="lg" type="submit" className="w-full h-14 text-xl font-black rounded-2xl group">
          Next: Tell your story
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </form>
  )
}
