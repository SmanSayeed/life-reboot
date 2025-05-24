import { supabase } from "./supabase"

export const checkAuthStatus = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export const signInWithEmail = async (email: string) => {
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

export const updateUserProfile = async (userId: string, updates: { preferred_language?: string; theme?: string }) => {
  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

  if (error) {
    console.error("Error updating user profile:", error)
    return null
  }

  return data
}
