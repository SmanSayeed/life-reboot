'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, Circle, Plus, XCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

type Habit = Database['public']['Tables']['habits']['Row']

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  time_of_day: z.enum(['morning', 'afternoon', 'evening']),
})

type FormData = z.infer<typeof formSchema>

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      time_of_day: 'morning',
    },
  })

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('date', today)
        .order('created_at', { ascending: true })

      if (error) throw error
      setHabits(data || [])
    } catch (error) {
      console.error('Error fetching habits:', error)
      toast({
        title: 'Error',
        description: 'Failed to load habits. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const { error } = await supabase.from('habits').insert({
        title: data.title,
        description: data.description,
        time_of_day: data.time_of_day,
        date: today,
        status: 'pending',
      })

      if (error) throw error

      form.reset()
      fetchHabits()
      toast({
        title: 'Success',
        description: 'Habit created successfully.',
      })
    } catch (error) {
      console.error('Error creating habit:', error)
      toast({
        title: 'Error',
        description: 'Failed to create habit. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const updateHabitStatus = async (habitId: string, status: 'completed' | 'skipped') => {
    try {
      const { error } = await supabase
        .from('habits')
        .update({ status })
        .eq('id', habitId)

      if (error) throw error

      fetchHabits()
      toast({
        title: 'Success',
        description: `Habit marked as ${status}.`,
      })
    } catch (error) {
      console.error('Error updating habit:', error)
      toast({
        title: 'Error',
        description: 'Failed to update habit. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const habitsByTimeOfDay = {
    morning: habits.filter((h) => h.time_of_day === 'morning'),
    afternoon: habits.filter((h) => h.time_of_day === 'afternoon'),
    evening: habits.filter((h) => h.time_of_day === 'evening'),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
        <p className="text-muted-foreground">Create and track your daily habits.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Habit</CardTitle>
          <CardDescription>Create a new habit to track</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter habit title" {...field} />
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
                      <Input placeholder="Enter habit description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time_of_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time of Day</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time of day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                <Plus className="mr-2 h-4 w-4" />
                Add Habit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Habits</CardTitle>
          <CardDescription>Track your habits for today</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="morning">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="morning">Morning</TabsTrigger>
              <TabsTrigger value="afternoon">Afternoon</TabsTrigger>
              <TabsTrigger value="evening">Evening</TabsTrigger>
            </TabsList>
            {(['morning', 'afternoon', 'evening'] as const).map((timeOfDay) => (
              <TabsContent key={timeOfDay} value={timeOfDay}>
                {habitsByTimeOfDay[timeOfDay].length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No habits scheduled for {timeOfDay}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {habitsByTimeOfDay[timeOfDay].map((habit) => (
                      <div
                        key={habit.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-medium">{habit.title}</p>
                          {habit.description && (
                            <p className="text-sm text-muted-foreground">{habit.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateHabitStatus(habit.id, 'completed')}
                            disabled={habit.status === 'completed'}
                          >
                            <CheckCircle2
                              className={`h-5 w-5 ${
                                habit.status === 'completed' ? 'text-green-500' : 'text-gray-500'
                              }`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateHabitStatus(habit.id, 'skipped')}
                            disabled={habit.status === 'skipped'}
                          >
                            <XCircle
                              className={`h-5 w-5 ${
                                habit.status === 'skipped' ? 'text-red-500' : 'text-gray-500'
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 