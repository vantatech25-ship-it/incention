import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CreationStep = 1 | 2 | 3 | 4 | 5

interface CreationState {
  step: CreationStep
  formData: {
    title: string
    category_id: string
    goal_amount: number
    story: string
    cover_image_url: string
    gallery_urls: string[]
    beneficiary_name: string
    beneficiary_relation: string
    location: string
  }
  setStep: (step: CreationStep) => void
  updateFormData: (data: Partial<CreationState['formData']>) => void
  reset: () => void
}

const initialFormData = {
  title: '',
  category_id: '',
  goal_amount: 0,
  story: '',
  cover_image_url: '',
  gallery_urls: [],
  beneficiary_name: '',
  beneficiary_relation: '',
  location: '',
}

export const useCreationStore = create<CreationState>()(
  persist(
    (set) => ({
      step: 1,
      formData: initialFormData,
      setStep: (step) => set({ step }),
      updateFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
      })),
      reset: () => set({ step: 1, formData: initialFormData }),
    }),
    {
      name: 'fundraiser-creation-store',
    }
  )
)
