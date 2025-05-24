"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HabitCard } from "@/components/organisms/habit-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { HabitEditForm } from "@/components/organisms/habit-edit-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatDateString } from "@/lib/date-utils"
import { supabase } from "@/lib/supabase"

interface HabitColumnProps {
  title: string
  timeOfDay: "morning" | "afternoon" | "evening" | "completed"
  habits: any[]
  userId: string
  date: string
  onDrop: (habit: any, newTimeOfDay: "morning" | "afternoon" | "evening" | "completed") => void
}

export function HabitColumn({ title, timeOfDay, habits, userId, date, onDrop }: HabitColumnProps) {
  const [isAddingHabit, setIsAddingHabit] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const habitId = e.dataTransfer.getData("habitId")
    const habit = habits.find((h) => h.id === habitId) || habits.find((h) => h.id.toString() === habitId)

    if (habit && habit.time_of_day !== timeOfDay) {
      onDrop(habit, timeOfDay)
    }
  }

  const handleAddHabit = async (habitData: { title: string; description: string }) => {
    try {
      const formattedDate = formatDateString(date)

      const { data, error } = await supabase
        .from("habits")
        .insert({
          user_id: userId,
          title: habitData.title,
          description: habitData.description || null,
          time_of_day: timeOfDay,
          date: formattedDate,
          status: timeOfDay === "completed" ? "completed" : "pending",
        })
        .select()
        .single()

      if (error) throw error

      // Refresh the page to show the new habit
      window.location.reload()
    } catch (error) {
      console.error("Error adding habit:", error)
    } finally {
      setIsAddingHabit(false)
    }
  }

  return (
    <>
      <Card className="h-full" onDragOver={handleDragOver} onDrop={handleDrop}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            {title}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsAddingHabit(true)}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add habit</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {habits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No habits in this column</div>
          ) : (
            habits.map((habit) => <HabitCard key={habit.id} habit={habit} />)
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
          </DialogHeader>
          <HabitEditForm onSubmit={handleAddHabit} onCancel={() => setIsAddingHabit(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
