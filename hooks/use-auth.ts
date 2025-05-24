import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { type User, type Provider } from '@supabase/supabase-js'

interface AuthError {
  message: string
  status?: number
}

interface UserMetadata {
  username?: string
  first_name?: string
  last_name?: string
  gender?: string
  country?: string
  education?: string
  current_position?: string
  ip_address?: string
  location?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Get user's IP and location
  const getUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      return {
        ip_address: data.ip,
        location: `${data.city}, ${data.country_name}`
      }
    } catch (error) {
      console.error('Error getting location:', error)
      return null
    }
  }

  // Update user metadata
  const updateUserMetadata = async (metadata: Partial<UserMetadata>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: metadata
      })
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating user metadata:', error)
      return false
    }
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        // Get and update location data if not already present
        if (user && !user.user_metadata.ip_address) {
          const locationData = await getUserLocation()
          if (locationData) {
            await updateUserMetadata(locationData)
          }
        }
      } catch (error) {
        console.error('Error getting user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user && !session.user.user_metadata.ip_address) {
        const locationData = await getUserLocation()
        if (locationData) {
          await updateUserMetadata(locationData)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null)
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        if (data.user) {
          // Get and update location data
          const locationData = await getUserLocation()
          if (locationData) {
            await updateUserMetadata(locationData)
          }
          router.push('/dashboard')
        }
      } catch (error: any) {
        console.error('Error signing in:', error)
        setError({
          message: error.message || 'Invalid email or password',
          status: error.status
        })
        throw error
      }
    },
    [router, supabase.auth]
  )

  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null)
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              username: email.split('@')[0], // Default username from email
            }
          }
        })
        if (error) throw error
        
        // Show success message even if confirmation email is sent
        return {
          success: true,
          message: 'Please check your email for verification link'
        }
      } catch (error: any) {
        console.error('Error signing up:', error)
        if (error.message.includes('already registered')) {
          setError({
            message: 'This email is already registered. Please try logging in.',
            status: 409
          })
        } else {
          setError({
            message: error.message || 'Error creating account',
            status: error.status
          })
        }
        throw error
      }
    },
    [supabase.auth]
  )

  const signInWithGoogle = useCallback(
    async () => {
      try {
        setError(null)
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        })
        if (error) throw error
      } catch (error: any) {
        console.error('Error signing in with Google:', error)
        setError({
          message: error.message || 'Error signing in with Google',
          status: error.status
        })
        throw error
      }
    },
    [supabase.auth]
  )

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (error: any) {
      console.error('Error signing out:', error)
      setError({
        message: error.message || 'Error signing out',
        status: error.status
      })
      throw error
    }
  }, [router, supabase.auth])

  const resetPassword = useCallback(
    async (email: string) => {
      try {
        setError(null)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password/confirm`,
        })
        if (error) throw error
        return {
          success: true,
          message: 'Password reset instructions sent to your email'
        }
      } catch (error: any) {
        console.error('Error resetting password:', error)
        setError({
          message: error.message || 'Error sending reset instructions',
          status: error.status
        })
        throw error
      }
    },
    [supabase.auth]
  )

  const updateProfile = useCallback(
    async (metadata: Partial<UserMetadata>) => {
      try {
        setError(null)
        const { error } = await supabase.auth.updateUser({
          data: metadata
        })
        if (error) throw error
        return {
          success: true,
          message: 'Profile updated successfully'
        }
      } catch (error: any) {
        console.error('Error updating profile:', error)
        setError({
          message: error.message || 'Error updating profile',
          status: error.status
        })
        throw error
      }
    },
    [supabase.auth]
  )

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle,
    updateProfile
  }
} 