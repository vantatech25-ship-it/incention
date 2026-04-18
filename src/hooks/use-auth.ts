'use client'

import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth-store'
import { useEffect } from 'react'

export function useAuth() {
  const { user, setUser, isLoading, setIsLoading } = useAuthStore()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error loading user:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth, setUser, setIsLoading])

  return {
    user,
    isLoading,
    signOut: async () => {
      await supabase.auth.signOut()
      setUser(null)
    }
  }
}
