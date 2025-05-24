"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/lib/redux/store"
import { type Habit, fetchHabits, moveHabit, moveHabitLocally } from "@/lib/redux/slices/habitsSlice"
import { fetchNote } from "@/lib/redux/slices/notesSlice"
import { DateNavigator } from "@/components/molecules/date-navigator"
import { HabitColumn } from "@/components/organisms/habit-column"
import { DailyNotes } from "@/components/organisms/daily-notes"
import { DailyBoardSkeleton } from "@/components/molecules/loading-skeleton"
import { useLocale } from "@/components/locale-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WifiOff } from "lucide-react"
import { setOnlineStatus } from "@/lib/redux/slices/uiSlice"
import { getRandomQuote } from "@/lib/default-habits"

interface DailyBoardProps {
  userId: string
  date: string
}

export function DailyBoard({ userId, date }: DailyBoardProps) {
  const dispatch = useDispatch()
  const { t } = useLocale()
  const { items: habits, loading } = useSelector((state: RootState) => state.habits)
  const isOnline = useSelector((state: RootState) => state.ui.isOnline)
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
    // Fetch habits and notes
    if (userId) {
      if (isOnline) {
        dispatch(fetchHabits({ userId, date }))
        dispatch(fetchNote({ userId, date }))
      } else {
        // Load from local storage if offline
        const storedHabits = localStorage.getItem(`habits-${date}`)
        const storedNote = localStorage.getItem(`note-${date}`)

        if (storedHabits) {
          // TODO: Set offline habits
        }

        if (storedNote) {
          // TODO: Set offline note
        }
      }
    }

    // Get a random quote
    setQuote(getRandomQuote())
  }, [userId, date, dispatch, isOnline])

  const handleDrop = (habit: Habit, newTimeOfDay: "morning" | "afternoon" | "evening" | "completed") => {
    if (habit.time_of_day === newTimeOfDay) return

    if (isOnline) {
      dispatch(moveHabit({ id: habit.id, newTimeOfDay }))
    } else {
      dispatch(moveHabitLocally({ id: habit.id, newTimeOfDay }))
    }
  }

  if (loading) {
    return <DailyBoardSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <DateNavigator currentDate={date} />
      </div>

      {!isOnline && (
        <Alert variant="warning">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>{t("offline.title")}</AlertTitle>
          <AlertDescription>{t("offline.message")}</AlertDescription>
        </Alert>
      )}

      {quote && (
        <div className="bg-muted/50 p-4 rounded-lg border">
          <blockquote className="italic text-muted-foreground">"{quote.text}"</blockquote>
          <div className="text-sm mt-2 text-right">— {quote.source}</div>
        </div>
      )}

      <DailyNotes userId={userId} date={date} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HabitColumn
          title={t("habits.morning")}
          timeOfDay="morning"
          habits={morningHabits}
          userId={userId}
          date={date}
          onDrop={handleDrop}
        />
        <HabitColumn
          title={t("habits.afternoon")}
          timeOfDay="afternoon"
          habits={afternoonHabits}
          userId={userId}
          date={date}
          onDrop={handleDrop}
        />
        <HabitColumn
          title={t("habits.evening")}
          timeOfDay="evening"
          habits={eveningHabits}
          userId={userId}
          date={date}
          onDrop={handleDrop}
        />
        <HabitColumn
          title={t("habits.completed")}
          timeOfDay="completed"
          habits={completedHabits}
          userId={userId}
          date={date}
          onDrop={handleDrop}
        />
      </div>
    </div>
  )
}
