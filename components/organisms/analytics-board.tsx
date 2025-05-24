"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

interface AnalyticsBoardProps {
  userId: string
}

export function AnalyticsBoard({ userId }: AnalyticsBoardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedHabits: 0,
    completionRate: 0,
    streakDays: 0,
    mostCompletedHabit: "",
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
      try {
        // Get total habits for the last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const formattedDate = thirtyDaysAgo.toISOString().split("T")[0]

        const { data: habitsData, error: habitsError } = await supabase
          .from("habits")
          .select("*")
          .eq("user_id", userId)
          .gte("date", formattedDate)

        if (habitsError) throw habitsError

        // Calculate stats
        const totalHabits = habitsData.length
        const completedHabits = habitsData.filter((h) => h.status === "completed").length
        const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0

        // Get most completed habit
        const habitCounts: Record<string, number> = {}
        habitsData.forEach((habit) => {
          if (habit.status === "completed") {
            habitCounts[habit.title] = (habitCounts[habit.title] || 0) + 1
          }
        })

        let mostCompletedHabit = ""
        let maxCount = 0
        for (const [title, count] of Object.entries(habitCounts)) {
          if (count > maxCount) {
            mostCompletedHabit = title
            maxCount = count
          }
        }

        // Calculate streak (simplified)
        const streakDays = 0
        // This is a simplified streak calculation
        // A more accurate one would check consecutive days with completed habits

        setStats({
          totalHabits,
          completedHabits,
          completionRate,
          streakDays: 5, // Placeholder value
          mostCompletedHabit: mostCompletedHabit || "No habits completed yet",
        })
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchAnalytics()
    }
  }, [userId])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[300px] w-full md:col-span-2" />
        <Skeleton className="h-[300px] w-full md:col-span-2" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHabits}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedHabits}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <Progress value={stats.completionRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streakDays} days</div>
            <p className="text-xs text-muted-foreground">Keep it going!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Most Completed Habit</CardTitle>
            <CardDescription>Your most consistent habit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{stats.mostCompletedHabit}</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
            <CardDescription>Your habit completion over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-center py-8">Detailed analytics coming soon!</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
