"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDateForDisplay } from "@/lib/date-utils"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"

interface HistoryBoardProps {
  userId: string
}

export function HistoryBoard({ userId }: HistoryBoardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [completedDates, setCompletedDates] = useState<Date[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true)
      try {
        // Get history for the last 90 days
        const ninetyDaysAgo = new Date()
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
        const formattedDate = ninetyDaysAgo.toISOString().split("T")[0]

        const { data, error } = await supabase
          .from("habits")
          .select("*")
          .eq("user_id", userId)
          .gte("date", formattedDate)
          .order("date", { ascending: false })

        if (error) throw error

        setHistory(data || [])

        // Get dates with completed habits for the calendar
        const dates = new Set<string>()
        data?.forEach((item) => {
          if (item.status === "completed") {
            dates.add(item.date)
          }
        })

        const completedDatesArray = Array.from(dates).map((dateStr) => new Date(dateStr))
        setCompletedDates(completedDatesArray)
      } catch (error) {
        console.error("Error fetching history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchHistory()
    }
  }, [userId])

  // Filter history by selected date
  const filteredHistory = history.filter((item) => {
    if (!selectedDate) return false
    const itemDate = new Date(item.date)
    return (
      itemDate.getDate() === selectedDate.getDate() &&
      itemDate.getMonth() === selectedDate.getMonth() &&
      itemDate.getFullYear() === selectedDate.getFullYear()
    )
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Habit Calendar</CardTitle>
          <CardDescription>Select a date to view your habits</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              completed: completedDates,
            }}
            modifiersClassNames={{
              completed: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate ? formatDateForDisplay(selectedDate.toISOString().split("T")[0]) : "Select a date"}
          </CardTitle>
          <CardDescription>Your habits for this day</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No habits found for this date</div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    {item.description && <div className="text-sm text-muted-foreground">{item.description}</div>}
                  </div>
                  <Badge variant={item.status === "completed" ? "default" : "outline"}>{item.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
