import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { supabase } from "@/lib/supabase"
import { formatDateString } from "@/lib/date-utils"

export type DailyNote = {
  id: string
  user_id: string
  date: string
  note_content: string
  created_at?: string
}

type NotesState = {
  currentNote: DailyNote | null
  loading: boolean
  error: string | null
  syncStatus: "idle" | "syncing" | "synced" | "error"
  lastSynced: string | null
}

const initialState: NotesState = {
  currentNote: null,
  loading: false,
  error: null,
  syncStatus: "idle",
  lastSynced: null,
}

// Async thunks for Supabase operations
export const fetchNote = createAsyncThunk(
  "notes/fetchNote",
  async ({ userId, date }: { userId: string; date: string }, { rejectWithValue }) => {
    try {
      const formattedDate = formatDateString(date)
      const { data, error } = await supabase
        .from("daily_notes")
        .select("*")
        .eq("user_id", userId)
        .eq("date", formattedDate)
        .single()

      if (error) {
        // If no note exists for this date, return null (not an error)
        if (error.code === "PGRST116") {
          return null
        }
        throw error
      }

      return data as DailyNote
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

export const saveNote = createAsyncThunk(
  "notes/saveNote",
  async (note: { user_id: string; date: string; note_content: string; id?: string }, { rejectWithValue }) => {
    try {
      const formattedDate = formatDateString(note.date)

      // Check if note already exists
      const { data: existingNote } = await supabase
        .from("daily_notes")
        .select("id")
        .eq("user_id", note.user_id)
        .eq("date", formattedDate)
        .single()

      let result

      if (existingNote) {
        // Update existing note
        const { data, error } = await supabase
          .from("daily_notes")
          .update({ note_content: note.note_content })
          .eq("id", existingNote.id)
          .select()
          .single()

        if (error) throw error
        result = data
      } else {
        // Insert new note
        const { data, error } = await supabase
          .from("daily_notes")
          .insert({
            user_id: note.user_id,
            date: formattedDate,
            note_content: note.note_content,
          })
          .select()
          .single()

        if (error) throw error
        result = data
      }

      return result as DailyNote
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setOfflineNote: (state, action: PayloadAction<DailyNote | null>) => {
      state.currentNote = action.payload
    },
    updateNoteContentLocally: (state, action: PayloadAction<string>) => {
      if (state.currentNote) {
        state.currentNote.note_content = action.payload
      }
    },
    setSyncStatus: (state, action: PayloadAction<"idle" | "syncing" | "synced" | "error">) => {
      state.syncStatus = action.payload
      if (action.payload === "synced") {
        state.lastSynced = new Date().toISOString()
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchNote
      .addCase(fetchNote.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNote.fulfilled, (state, action) => {
        state.loading = false
        state.currentNote = action.payload
        state.lastSynced = new Date().toISOString()
      })
      .addCase(fetchNote.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // saveNote
      .addCase(saveNote.pending, (state) => {
        state.syncStatus = "syncing"
      })
      .addCase(saveNote.fulfilled, (state, action) => {
        state.currentNote = action.payload
        state.syncStatus = "synced"
        state.lastSynced = new Date().toISOString()
      })
      .addCase(saveNote.rejected, (state) => {
        state.syncStatus = "error"
      })
  },
})

export const { setOfflineNote, updateNoteContentLocally, setSyncStatus } = notesSlice.actions
export default notesSlice.reducer
