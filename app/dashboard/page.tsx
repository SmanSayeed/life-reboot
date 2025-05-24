'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { format } from 'date-fns'
import { CheckCircle2, Circle, XCircle } from 'lucide-react'

type Habit = Database['public']['Tables']['habits']['Row']
type Task = Database['public']['Tables']['tasks']['Row']

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd')

        // Fetch today's habits
        const { data: habitsData, error: habitsError } = await supabase
          .from('habits')
          .select('*')
          .eq('date', today)
          .order('created_at', { ascending: true })

        if (habitsError) throw habitsError
        setHabits(habitsData || [])

        // Fetch today's tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('date', today)
          .order('created_at', { ascending: true })

        if (tasksError) throw tasksError
        setTasks(tasksData || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const habitStats = {
    total: habits.length,
    completed: habits.filter((h) => h.status === 'completed').length,
    pending: habits.filter((h) => h.status === 'pending').length,
    skipped: habits.filter((h) => h.status === 'skipped').length,
  }

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'done').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    todo: tasks.filter((t) => t.status === 'todo').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your progress today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Habits Progress</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {habitStats.completed}/{habitStats.total}
            </div>
            <Progress
              value={(habitStats.completed / (habitStats.total || 1)) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {((habitStats.completed / (habitStats.total || 1)) * 100).toFixed(0)}% completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Progress</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {taskStats.completed}/{taskStats.total}
            </div>
            <Progress
              value={(taskStats.completed / (taskStats.total || 1)) * 100}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {((taskStats.completed / (taskStats.total || 1)) * 100).toFixed(0)}% completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Habits</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{habitStats.pending}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {habitStats.skipped} habits skipped today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks in Progress</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {taskStats.todo} tasks remaining
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Habits</CardTitle>
            <CardDescription>Your habit tracking for today</CardDescription>
          </CardHeader>
          <CardContent>
            {habits.length === 0 ? (
              <p className="text-sm text-muted-foreground">No habits scheduled for today</p>
            ) : (
              <div className="space-y-2">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div>
                      <p className="font-medium">{habit.title}</p>
                      <p className="text-sm text-muted-foreground">{habit.time_of_day}</p>
                    </div>
                    <div>
                      {habit.status === 'completed' && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {habit.status === 'pending' && (
                        <Circle className="h-5 w-5 text-yellow-500" />
                      )}
                      {habit.status === 'skipped' && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Tasks</CardTitle>
            <CardDescription>Your task list for today</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks scheduled for today</p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      {task.scheduled_time && (
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(`2000-01-01T${task.scheduled_time}`), 'h:mm a')}
                        </p>
                      )}
                    </div>
                    <div>
                      {task.status === 'done' && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {task.status === 'in_progress' && (
                        <Circle className="h-5 w-5 text-yellow-500" />
                      )}
                      {task.status === 'todo' && (
                        <Circle className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
