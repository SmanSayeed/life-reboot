"use client"

import { useEffect, useState } from "react"
import { DateNavigator } from "@/components/molecules/date-navigator"
import { HabitColumn } from "@/components/organisms/habit-column"
import { DailyNotes } from "@/components/organisms/daily-notes"
import { KanbanBoard } from "@/components/organisms/kanban-board"
import { IslamicQuotes } from "@/components/organisms/islamic-quotes"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WifiOff } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatDateString } from "@/lib/date-utils"
import { getDefaultHabits, getRandomQuote } from "@/lib/default-habits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { setOnlineStatus } from "@/lib/redux/slices/uiSlice"

interface DailyBoardProps {
  userId: string
  date: string
}

type Habit = {
  id: string
  user_id: string
  title: string
  description: string | null
  time_of_day: "morning" | "afternoon" | "evening" | "completed"
  date: string
  status: "pending" | "completed"
  created_at?: string
}

export function DailyBoard({ userId, date }: DailyBoardProps) {
  const dispatch = useDispatch()
  const isOnline = useSelector((state: RootState) => state.ui.isOnline)
  const [isLoading, setIsLoading] = useState(true)
  const [habits, setHabits] = useState<Habit[]>([])
  const [quote, setQuote] = useState<{ text: string; source: string }>()

  // Group habits by time of day
  const morningHabits = habits.filter((h) => h.time_of_day === "morning")
  const afternoonHabits = habits.filter((h) => h.time_of_day === "afternoon")
  const eveningHabits = habits.filter((h) => h.time_of_day === "evening")
  const completedHabits = habits.filter((h) => h.time_of_day === "completed")

  useEffect(() => {
    // Check online status
    const handleOnlineStatus = () => {
      dispatch(setOnlineStatus(navigator.onLine))
    }

    window.addEventListener("online", handleOnlineStatus)
    window.addEventListener("offline", handleOnlineStatus)

    // Initial check
    dispatch(setOnlineStatus(navigator.onLine))

    return () => {
      window.removeEventListener("online", handleOnlineStatus)
      window.removeEventListener("offline", handleOnlineStatus)
    }
  }, [dispatch])

  useEffect(() => {
    const fetchHabits = async () => {
      setIsLoading(true)
      try {
        const formattedDate = formatDateString(date)
        const { data, error } = await supabase
          .from("habits")
          .select("*")
          .eq("user_id", userId)
          .eq("date", formattedDate)

        if (error) throw error

        // If no habits for this date, create default habits
        if (data.length === 0) {
          const defaultHabits = getDefaultHabits(userId, formattedDate)

          // Insert default habits into Supabase
          const { data: insertedData, error: insertError } = await supabase
            .from("habits")
            .insert(defaultHabits)
            .select()

          if (insertError) throw insertError

          setHabits(insertedData as Habit[])
        } else {
          setHabits(data as Habit[])
        }
      } catch (error) {
        console.error("Error fetching habits:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchHabits()
      setQuote(getRandomQuote())
    }
  }, [userId, date])

  const handleDrop = async (habit: Habit, newTimeOfDay: "morning" | "afternoon" | "evening" | "completed") => {
    if (habit.time_of_day === newTimeOfDay) return

    try {
      // Optimistically update UI
      setHabits((prevHabits) =>
        prevHabits.map((h) =>
          h.id === habit.id
            ? {
                ...h,
                time_of_day: newTimeOfDay,
                status: newTimeOfDay === "completed" ? "completed" : "pending",
              }
            : h,
        ),
      )

      // Update in database
      const { error } = await supabase
        .from("habits")
        .update({
          time_of_day: newTimeOfDay,
          status: newTimeOfDay === "completed" ? "completed" : "pending",
        })
        .eq("id", habit.id)

      if (error) throw error

      // Add to history if completed
      if (newTimeOfDay === "completed") {
        await supabase.from("history").insert({
          user_id: habit.user_id,
          habit_id: habit.id,
          date: habit.date,
          status: "completed",
        })
      }
    } catch (error) {
      console.error("Error updating habit:", error)
      // Revert optimistic update on error
      const { data } = await supabase.from("habits").select("*").eq("id", habit.id).single()
      if (data) {
        setHabits((prevHabits) => prevHabits.map((h) => (h.id === habit.id ? (data as Habit) : h)))
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <Skeleton className="h-[100px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <DateNavigator currentDate={date} />
      </div>

      {!isOnline && (
        <Alert variant="warning">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>You are offline</AlertTitle>
          <AlertDescription>
            Changes will be saved locally and synced when you reconnect to the internet.
          </AlertDescription>
        </Alert>
      )}

      <IslamicQuotes />

      <Tabs defaultValue="habits" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="habits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <HabitColumn
              title="Morning"
              timeOfDay="morning"
              habits={morningHabits}
              userId={userId}
              date={date}
              onDrop={handleDrop}
            />
            <HabitColumn
              title="Afternoon"
              timeOfDay="afternoon"
              habits={afternoonHabits}
              userId={userId}
              date={date}
              onDrop={handleDrop}
            />
            <HabitColumn
              title="Evening"
              timeOfDay="evening"
              habits={eveningHabits}
              userId={userId}
              date={date}
              onDrop={handleDrop}
            />
            <HabitColumn
              title="Completed"
              timeOfDay="completed"
              habits={completedHabits}
              userId={userId}
              date={date}
              onDrop={handleDrop}
            />
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <KanbanBoard userId={userId} date={date} />
        </TabsContent>

        <TabsContent value="notes">
          <DailyNotes userId={userId} date={date} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
