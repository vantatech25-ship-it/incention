'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: any | null
  setUser: (user: any | null) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      isLoading: true,
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
