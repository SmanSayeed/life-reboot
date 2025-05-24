"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { NavBar } from "@/components/organisms/nav-bar"
import { AppDrawer } from "@/components/organisms/app-drawer"
import { Footer } from "@/components/organisms/footer"
import { getCurrentUser } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface DashboardTemplateProps {
  children: React.ReactNode
}

export function DashboardTemplate({ children }: DashboardTemplateProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      const user = await getCurrentUser()

      if (user) {
        setUserId(user.id)
      }

      setIsLoading(false)
    }

    fetchUser()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar userId={userId} />
      <AppDrawer />
      <main className="flex-1 container py-6">{children}</main>
      <Footer />
    </div>
  )
}
