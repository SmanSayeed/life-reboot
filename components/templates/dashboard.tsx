"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { NavBar } from "@/components/organisms/nav-bar"
import { AppDrawer } from "@/components/organisms/app-drawer"
import { getCurrentUser } from "@/lib/supabase"

interface DashboardTemplateProps {
  children: React.ReactNode
}

export function DashboardTemplate({ children }: DashboardTemplateProps) {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser()
      setUserId(user?.id || null)
    }

    fetchUser()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <AppDrawer />
      <main className="flex-1 container py-6">{children}</main>
    </div>
  )
}
