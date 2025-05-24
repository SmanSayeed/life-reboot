import { createBrowserClient } from '@supabase/ssr'
import type { Database } from "@/types/supabase"

// Create a single supabase client for the entire app
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Function to get the current user
export const getCurrentUser = async () => {
  if (typeof window === "undefined") return null

  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error("Error getting user session:", error)
    return null
  }

  return data.session?.user || null
}

// Function to sign in with magic link
export const signInWithMagicLink = async (email: string) => {
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  })
}

// Function to sign out
export const signOut = async () => {
  return await supabase.auth.signOut()
}
