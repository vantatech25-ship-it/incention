'use client'

import { useCreationStore } from '@/store/use-creation-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, UserCircle, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

export function StepDetails() {
  const { formData, updateFormData, setStep } = useCreationStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.beneficiary_name || !formData.location) {
      toast.error("Please provide a beneficiary and location")
      return
    }
    setStep(5)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Who are you fundraising for?</h2>
        <p className="text-muted-foreground text-lg">
          Transparency is key to trust. Let donors know exactly where their money is going.
        </p>
      </div>

      <div className="space-y-8 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                 <UserCircle className="h-5 w-5" />
                 <Label htmlFor="beneficiary" className="font-bold text-lg uppercase tracking-wider text-[10px]">Beneficiary Information</Label>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="beneficiary_name">Full Name</Label>
                 <Input 
                   id="beneficiary_name"
                   value={formData.beneficiary_name}
                   onChange={(e) => updateFormData({ beneficiary_name: e.target.value })}
                   placeholder="e.g. Sarah Miller"
                   className="h-12 rounded-xl"
                 />
              </div>
              <div className="space-y-2">
                 <Label htmlFor="relation">Your relation to them</Label>
                 <Select 
                   value={formData.beneficiary_relation} 
                   onValueChange={(val) => updateFormData({ beneficiary_relation: val })}
                 >
                   <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select relation" />
                   </SelectTrigger>
                   <SelectContent>
                      <SelectItem value="myself">Myself</SelectItem>
                      <SelectItem value="family">Family member</SelectItem>
                      <SelectItem value="friend">A friend</SelectItem>
                      <SelectItem value="charity">Non-profit / Charity</SelectItem>
                      <SelectItem value="community">Community project</SelectItem>
                   </SelectContent>
                 </Select>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                 <MapPin className="h-5 w-5" />
                 <Label htmlFor="location" className="font-bold text-lg uppercase tracking-wider text-[10px]">Campaign Location</Label>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="location">Where is this happening?</Label>
                 <Input 
                   id="location"
                   value={formData.location}
                   onChange={(e) => updateFormData({ location: e.target.value })}
                   placeholder="e.g. Cape Town, South Africa"
                   className="h-12 rounded-xl"
                 />
                 <p className="text-[10px] text-muted-foreground">Donors like to know the local impact of their support.</p>
              </div>
           </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900 shadow-sm">
           <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
             <strong>Safety Tip:</strong> Keep the beneficiary's exact home address private for their protection. A city or neighborhood is perfect.
           </p>
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={() => setStep(3)}
          className="h-14 px-8 rounded-2xl font-bold"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button 
          size="lg" 
          type="submit"
          className="h-14 flex-1 text-xl font-black rounded-2xl group"
        >
          Next: Review campaign
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </form>
  )
}
