'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

type Task = Database['public']['Tables']['tasks']['Row']

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  scheduled_time: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      scheduled_time: '',
    },
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('date', today)
        .order('created_at', { ascending: true })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast({
        title: 'Error',
        description: 'Failed to load tasks. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const { error } = await supabase.from('tasks').insert({
        title: data.title,
        description: data.description,
        scheduled_time: data.scheduled_time || null,
        date: today,
        status: 'todo',
      })

      if (error) throw error

      form.reset()
      setDialogOpen(false)
      fetchTasks()
      toast({
        title: 'Success',
        description: 'Task created successfully.',
      })
    } catch (error) {
      console.error('Error creating task:', error)
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const updateTaskStatus = async (taskId: string, status: 'todo' | 'in_progress' | 'done') => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId)

      if (error) throw error

      fetchTasks()
      toast({
        title: 'Success',
        description: `Task moved to ${status.replace('_', ' ')}.`,
      })
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage your daily tasks</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Create a new task for today</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter task description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scheduled_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheduled Time (Optional)</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Creating...' : 'Create Task'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>To Do</CardTitle>
            <CardDescription>Tasks to be started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tasksByStatus.todo.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col rounded-lg border p-4 hover:border-primary/50"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{task.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateTaskStatus(task.id, 'in_progress')}
                    >
                      Start
                    </Button>
                  </div>
                  {task.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                  )}
                  {task.scheduled_time && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Scheduled: {format(new Date(`2000-01-01T${task.scheduled_time}`), 'h:mm a')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
            <CardDescription>Tasks being worked on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tasksByStatus.in_progress.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col rounded-lg border p-4 hover:border-primary/50"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{task.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateTaskStatus(task.id, 'done')}
                    >
                      Complete
                    </Button>
                  </div>
                  {task.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                  )}
                  {task.scheduled_time && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Scheduled: {format(new Date(`2000-01-01T${task.scheduled_time}`), 'h:mm a')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Done</CardTitle>
            <CardDescription>Completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tasksByStatus.done.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col rounded-lg border p-4 hover:border-primary/50"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{task.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateTaskStatus(task.id, 'todo')}
                    >
                      Reopen
                    </Button>
                  </div>
                  {task.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                  )}
                  {task.scheduled_time && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Scheduled: {format(new Date(`2000-01-01T${task.scheduled_time}`), 'h:mm a')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 