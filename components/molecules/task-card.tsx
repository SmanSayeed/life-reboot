"use client"

import type React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Task {
  id: string
  title: string
  description: string | null
  status: "todo" | "in_progress" | "done"
  scheduled_time: string | null
}

interface TaskCardProps {
  task: Task
  onMove: (taskId: string, newStatus: "todo" | "in_progress" | "done") => void
  onDelete: (taskId: string) => void
}

export function TaskCard({ task, onMove, onDelete }: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task.id)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      draggable
      onDragStart={handleDragStart}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm">{task.title}</h4>
            {task.scheduled_time && (
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {task.scheduled_time}
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {task.status !== "todo" && (
                <DropdownMenuItem onClick={() => onMove(task.id, "todo")}>Move to To Do</DropdownMenuItem>
              )}
              {task.status !== "in_progress" && (
                <DropdownMenuItem onClick={() => onMove(task.id, "in_progress")}>Move to In Progress</DropdownMenuItem>
              )}
              {task.status !== "done" && (
                <DropdownMenuItem onClick={() => onMove(task.id, "done")}>Move to Done</DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent className="p-3 pt-0">
          <p className="text-xs text-muted-foreground">{task.description}</p>
        </CardContent>
      )}
    </Card>
  )
}
