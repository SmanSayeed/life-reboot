"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { SettingsBoard } from "@/components/organisms/settings-board"

export function SettingsTemplate() {
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!userId) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Login Required</CardTitle>
          <CardDescription>You need to be logged in to access settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please log in to manage your account settings and preferences.</p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/login">Login</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return <SettingsBoard userId={userId} />
}
