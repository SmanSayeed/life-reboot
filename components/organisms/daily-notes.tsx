"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { formatDateString } from "@/lib/date-utils"
import { Skeleton } from "@/components/ui/skeleton"
import { debounce } from "lodash"
import { motion } from "framer-motion"

interface DailyNotesProps {
  userId: string
  date: string
}

export function DailyNotes({ userId, date }: DailyNotesProps) {
  const [noteContent, setNoteContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true)
      try {
        const formattedDate = formatDateString(date)
        const { data, error } = await supabase
          .from("daily_notes")
          .select("*")
          .eq("user_id", userId)
          .eq("date", formattedDate)
          .single()

        if (error) {
          if (error.code !== "PGRST116") {
            // PGRST116 means no rows returned, which is fine
            console.error("Error fetching note:", error)
          }
          setNoteContent("")
        } else {
          setNoteContent(data.note_content || "")
        }
      } catch (error) {
        console.error("Error fetching note:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchNote()
    }
  }, [userId, date])

  // Debounced save function
  const saveNote = debounce(async (content: string) => {
    if (!userId) return

    setIsSaving(true)
    try {
      const formattedDate = formatDateString(date)

      // Check if note already exists
      const { data: existingNote } = await supabase
        .from("daily_notes")
        .select("id")
        .eq("user_id", userId)
        .eq("date", formattedDate)
        .single()

      if (existingNote) {
        // Update existing note
        await supabase.from("daily_notes").update({ note_content: content }).eq("id", existingNote.id)
      } else {
        // Insert new note
        await supabase.from("daily_notes").insert({
          user_id: userId,
          date: formattedDate,
          note_content: content,
        })
      }
    } catch (error) {
      console.error("Error saving note:", error)
    } finally {
      setIsSaving(false)
    }
  }, 1000)

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value
    setNoteContent(content)
    saveNote(content)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[100px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Daily Notes
            {isSaving && <span className="text-xs text-muted-foreground">Saving...</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Write your thoughts, reflections, or plans for the day..."
            className="min-h-[100px]"
            value={noteContent}
            onChange={handleNoteChange}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
