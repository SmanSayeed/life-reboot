import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for the entire app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Check if we have the required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables. Check your .env file or Vercel project settings.")
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

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
