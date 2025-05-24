"use client"

import { useEffect, useState } from "react"
import { DailyBoard } from "@/components/organisms/daily-board"
import { getCurrentUser } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface DailyBoardTemplateProps {
  date: string
}

export function DailyBoardTemplate({ date }: DailyBoardTemplateProps) {
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
          <CardDescription>You need to be logged in to view your daily habits</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please log in to access your personalized habit tracking board and daily notes.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/login">Login</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return <DailyBoard userId={userId} date={date} />
}
