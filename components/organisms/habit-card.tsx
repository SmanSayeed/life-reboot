"use client"

import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { HabitEditForm } from "@/components/organisms/habit-edit-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"

interface HabitCardProps {
  habit: {
    id: string
    title: string
    description: string | null
    time_of_day: string
    status: string
  }
}

export function HabitCard({ habit }: HabitCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("habitId", habit.id)
  }

  const handleEdit = async (habitData: { title: string; description: string }) => {
    try {
      const { error } = await supabase
        .from("habits")
        .update({
          title: habitData.title,
          description: habitData.description || null,
        })
        .eq("id", habit.id)

      if (error) throw error

      // Refresh the page to show the updated habit
      window.location.reload()
    } catch (error) {
      console.error("Error updating habit:", error)
    } finally {
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from("habits").delete().eq("id", habit.id)

      if (error) throw error

      // Refresh the page to show the updated list
      window.location.reload()
    } catch (error) {
      console.error("Error deleting habit:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="cursor-grab active:cursor-grabbing" draggable onDragStart={handleDragStart}>
        <CardHeader className="p-3 pb-0 flex flex-row items-start justify-between">
          <div className="font-medium">{habit.title}</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleting(true)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        {habit.description && (
          <CardContent className="p-3 pt-1 text-sm text-muted-foreground">{habit.description}</CardContent>
        )}
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
          </DialogHeader>
          <HabitEditForm
            initialValues={{ title: habit.title, description: habit.description || "" }}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Habit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>Are you sure you want to delete this habit?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleting(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
