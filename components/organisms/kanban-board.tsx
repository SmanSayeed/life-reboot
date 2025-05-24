"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TaskCard } from "@/components/molecules/task-card"
import { TaskForm } from "@/components/molecules/task-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { formatDateString } from "@/lib/date-utils"

interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: "todo" | "in_progress" | "done"
  scheduled_time: string | null
  date: string
  created_at: string
}

interface KanbanBoardProps {
  userId: string
  date: string
}

export function KanbanBoard({ userId, date }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const todoTasks = tasks.filter((t) => t.status === "todo")
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress")
  const doneTasks = tasks.filter((t) => t.status === "done")

  useEffect(() => {
    fetchTasks()
  }, [userId, date])

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const formattedDate = formatDateString(date)
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .eq("date", formattedDate)
        .order("created_at", { ascending: true })

      if (error) throw error

      // If no tasks for this date, create default tasks
      if (data.length === 0) {
        const defaultTasks = getDefaultTasks(userId, formattedDate)
        const { data: insertedData, error: insertError } = await supabase.from("tasks").insert(defaultTasks).select()

        if (insertError) throw insertError
        setTasks(insertedData as Task[])
      } else {
        setTasks(data as Task[])
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTask = async (taskData: { title: string; description: string; scheduled_time: string }) => {
    try {
      const formattedDate = formatDateString(date)
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          user_id: userId,
          title: taskData.title,
          description: taskData.description || null,
          status: "todo",
          scheduled_time: taskData.scheduled_time || null,
          date: formattedDate,
        })
        .select()
        .single()

      if (error) throw error

      setTasks((prev) => [...prev, data as Task])
      setIsAddingTask(false)
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const handleTaskMove = async (taskId: string, newStatus: "todo" | "in_progress" | "done") => {
    try {
      const { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", taskId)

      if (error) throw error

      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId)

      if (error) throw error

      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const handleDrop = (e: React.DragEvent, status: "todo" | "in_progress" | "done") => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    if (taskId) {
      handleTaskMove(taskId, status)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  if (isLoading) {
    return <div>Loading tasks...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Board</h2>
        <Button onClick={() => setIsAddingTask(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card onDrop={(e) => handleDrop(e, "todo")} onDragOver={handleDragOver}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              To Do
              <span className="text-sm font-normal text-muted-foreground">{todoTasks.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} onMove={handleTaskMove} onDelete={handleTaskDelete} />
            ))}
          </CardContent>
        </Card>

        <Card onDrop={(e) => handleDrop(e, "in_progress")} onDragOver={handleDragOver}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              In Progress
              <span className="text-sm font-normal text-muted-foreground">{inProgressTasks.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} onMove={handleTaskMove} onDelete={handleTaskDelete} />
            ))}
          </CardContent>
        </Card>

        <Card onDrop={(e) => handleDrop(e, "done")} onDragOver={handleDragOver}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Done
              <span className="text-sm font-normal text-muted-foreground">{doneTasks.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {doneTasks.map((task) => (
              <TaskCard key={task.id} task={task} onMove={handleTaskMove} onDelete={handleTaskDelete} />
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={handleAddTask} onCancel={() => setIsAddingTask(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getDefaultTasks(userId: string, date: string) {
  return [
    {
      user_id: userId,
      title: "Review daily goals",
      description: "Check and update daily objectives",
      status: "todo",
      scheduled_time: "09:00",
      date: date,
    },
    {
      user_id: userId,
      title: "Complete work project",
      description: "Finish the assigned project tasks",
      status: "todo",
      scheduled_time: "14:00",
      date: date,
    },
    {
      user_id: userId,
      title: "Exercise session",
      description: "30 minutes of physical activity",
      status: "todo",
      scheduled_time: "18:00",
      date: date,
    },
  ]
}
