'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog'
import { CURRENCY_SYMBOL } from '@/lib/constants'
import { Landmark, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { requestWithdrawal } from '@/app/dashboard/withdrawals/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface WithdrawalRequestFormProps {
  fundraisers: any[]
  balances: any[]
}

export function WithdrawalRequestForm({ fundraisers, balances }: WithdrawalRequestFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [selectedFundraiserId, setSelectedFundraiserId] = useState(fundraisers[0]?.id || '')
  const [amount, setAmount] = useState(0)
  
  const [bankDetails, setBankDetails] = useState({
    accountHolder: '',
    bankName: '',
    accountNumber: '',
    branchCode: '',
    accountType: 'savings'
  })

  const currentBalance = balances.find((_, i) => fundraisers[i].id === selectedFundraiserId)?.availableToWithdraw || 0

  const handleNext = () => {
    if (step === 1) {
      if (amount < 100) {
        toast.error(`Minimum withdrawal is ${CURRENCY_SYMBOL}100`)
        return
      }
      if (amount * 100 > currentBalance) {
        toast.error("Amount exceeds available balance")
        return
      }
      setStep(2)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const result = await requestWithdrawal({
        fundraiserId: selectedFundraiserId,
        amount: amount * 100,
        bankDetails
      })

      if (result.success) {
        setSuccess(true)
        toast.success("Withdrawal request submitted!")
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="p-12 text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
           <CheckCircle2 className="h-12 w-12" />
        </div>
        <div className="space-y-2">
           <h3 className="text-2xl font-black">Request Submitted</h3>
           <p className="text-muted-foreground">We've received your withdrawal request. Funds will be processed within 2-3 business days to your {bankDetails.bankName} account.</p>
        </div>
        <Button className="w-full h-12 rounded-xl" onClick={() => window.location.reload()}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-primary p-8 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-white">Request Payout</DialogTitle>
          <DialogDescription className="text-white/80">
            Securely transfer your raised funds to your local South African bank account.
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="p-8 space-y-8">
        {step === 1 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="space-y-2">
                <Label className="font-bold">Select Fundraiser</Label>
                <Select value={selectedFundraiserId} onValueChange={setSelectedFundraiserId}>
                   <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select campaign" />
                   </SelectTrigger>
                   <SelectContent>
                      {fundraisers.map((f) => (
                        <SelectItem key={f.id} value={f.id}>{f.title}</SelectItem>
                      ))}
                   </SelectContent>
                </Select>
             </div>

             <div className="space-y-2">
                <div className="flex items-center justify-between">
                   <Label className="font-bold">Amount to Withdraw ({CURRENCY_SYMBOL})</Label>
                   <span className="text-xs font-bold text-muted-foreground uppercase">Max: {CURRENCY_SYMBOL}{(currentBalance / 100).toLocaleString()}</span>
                </div>
                <Input 
                   type="number" 
                   value={amount || ''} 
                   onChange={(e) => setAmount(Number(e.target.value))}
                   placeholder="0.00"
                   className="h-14 rounded-xl text-xl font-black"
                />
                <p className="text-[10px] text-muted-foreground font-medium">Minimum R100 required for processing.</p>
             </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center gap-2 pb-2 text-primary">
                <Landmark className="h-5 w-5" />
                <span className="font-bold uppercase tracking-widest text-[10px]">SA Banking Details</span>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account Holder</Label>
                   <Input 
                     value={bankDetails.accountHolder}
                     onChange={(e) => setBankDetails({...bankDetails, accountHolder: e.target.value})}
                     placeholder="John Doe"
                     className="h-11 rounded-xl"
                   />
                </div>
                <div className="space-y-1.5">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bank Name</Label>
                   <Input 
                     value={bankDetails.bankName}
                     onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                     placeholder="FNB, ABSA, Nedbank..."
                     className="h-11 rounded-xl"
                   />
                </div>
                <div className="space-y-1.5">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account Number</Label>
                   <Input 
                     value={bankDetails.accountNumber}
                     onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                     placeholder="1234567890"
                     className="h-11 rounded-xl"
                   />
                </div>
                <div className="space-y-1.5">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Branch Code</Label>
                   <Input 
                     value={bankDetails.branchCode}
                     onChange={(e) => setBankDetails({...bankDetails, branchCode: e.target.value})}
                     placeholder="250655"
                     className="h-11 rounded-xl"
                   />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                   <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account Type</Label>
                   <Select 
                     value={bankDetails.accountType} 
                     onValueChange={(val) => setBankDetails({...bankDetails, accountType: val})}
                   >
                      <SelectTrigger className="h-11 rounded-xl">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="savings">Savings Account</SelectItem>
                         <SelectItem value="current">Current / Cheque Account</SelectItem>
                         <SelectItem value="business">Business Account</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-8 pt-0 mt-auto">
        <Button 
          onClick={step === 1 ? handleNext : handleSubmit}
          disabled={loading}
          className="h-14 w-full rounded-2xl text-lg font-black shadow-xl shadow-primary/25"
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : step === 1 ? (
            <>
              Next: Bank Details
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            'Confirm Withdrawal'
          )}
        </Button>
        {step === 2 && (
          <Button 
            variant="ghost" 
            className="w-full mt-2 font-bold" 
            onClick={() => setStep(1)}
            disabled={loading}
          >
            Back to amount
          </Button>
        )}
      </div>
    </div>
  )
}
