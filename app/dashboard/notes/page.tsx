'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Calendar } from '@/components/ui/calendar'
import { Editor } from '@/components/editor'
import { Save } from 'lucide-react'

type DailyNote = Database['public']['Tables']['daily_notes']['Row']

export default function NotesPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [note, setNote] = useState<DailyNote | null>(null)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchNote()
  }, [selectedDate])

  const fetchNote = async () => {
    try {
      const date = format(selectedDate, 'yyyy-MM-dd')
      const { data, error } = await supabase
        .from('daily_notes')
        .select('*')
        .eq('date', date)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"

      if (data) {
        setNote(data)
        setContent(data.note_content || '')
      } else {
        setNote(null)
        setContent('')
      }
    } catch (error) {
      console.error('Error fetching note:', error)
      toast({
        title: 'Error',
        description: 'Failed to load note. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const saveNote = async () => {
    try {
      setSaving(true)
      const date = format(selectedDate, 'yyyy-MM-dd')

      if (note) {
        // Update existing note
        const { error } = await supabase
          .from('daily_notes')
          .update({ note_content: content })
          .eq('id', note.id)

        if (error) throw error
      } else {
        // Create new note
        const { error } = await supabase.from('daily_notes').insert({
          date,
          note_content: content,
        })

        if (error) throw error
      }

      toast({
        title: 'Success',
        description: 'Note saved successfully.',
      })
    } catch (error) {
      console.error('Error saving note:', error)
      toast({
        title: 'Error',
        description: 'Failed to save note. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daily Notes</h1>
        <p className="text-muted-foreground">Record your thoughts and reflections</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Choose a date to view or edit notes</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Notes for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
              <CardDescription>Write your daily reflection</CardDescription>
            </div>
            <Button onClick={saveNote} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </CardHeader>
          <CardContent>
            <Editor
              content={content}
              onChange={setContent}
              placeholder="Write your thoughts here..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 