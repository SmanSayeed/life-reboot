import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { supabase } from "@/lib/supabase"
import { getDefaultHabits } from "@/lib/default-habits"
import { formatDateString } from "@/lib/date-utils"

export type Habit = {
  id: string
  user_id: string
  title: string
  description: string | null
  time_of_day: "morning" | "afternoon" | "evening" | "completed"
  date: string
  status: "pending" | "completed"
  is_default: boolean
  created_at?: string
}

type HabitsState = {
  items: Habit[]
  loading: boolean
  error: string | null
  syncStatus: "idle" | "syncing" | "synced" | "error"
  lastSynced: string | null
}

const initialState: HabitsState = {
  items: [],
  loading: false,
  error: null,
  syncStatus: "idle",
  lastSynced: null,
}

// Async thunks for Supabase operations
export const fetchHabits = createAsyncThunk(
  "habits/fetchHabits",
  async ({ userId, date }: { userId: string; date: string }, { rejectWithValue }) => {
    try {
      const formattedDate = formatDateString(date)
      const { data, error } = await supabase.from("habits").select("*").eq("user_id", userId).eq("date", formattedDate)

      if (error) throw error

      // If no habits for this date, create default habits
      if (data.length === 0) {
        const defaultHabits = getDefaultHabits(userId, formattedDate)

        // Insert default habits into Supabase
        const { data: insertedData, error: insertError } = await supabase.from("habits").insert(defaultHabits).select()

        if (insertError) throw insertError

        return insertedData as Habit[]
      }

      return data as Habit[]
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

export const addHabit = createAsyncThunk(
  "habits/addHabit",
  async (habit: Omit<Habit, "id" | "created_at">, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("habits").insert(habit).select().single()

      if (error) throw error
      return data as Habit
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

export const updateHabit = createAsyncThunk(
  "habits/updateHabit",
  async ({ id, updates }: { id: string; updates: Partial<Habit> }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from("habits").update(updates).eq("id", id).select().single()

      if (error) throw error
      return data as Habit
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

export const deleteHabit = createAsyncThunk("habits/deleteHabit", async (id: string, { rejectWithValue }) => {
  try {
    const { error } = await supabase.from("habits").delete().eq("id", id)

    if (error) throw error
    return id
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const moveHabit = createAsyncThunk(
  "habits/moveHabit",
  async (
    { id, newTimeOfDay }: { id: string; newTimeOfDay: "morning" | "afternoon" | "evening" | "completed" },
    { rejectWithValue },
  ) => {
    try {
      const { data, error } = await supabase
        .from("habits")
        .update({
          time_of_day: newTimeOfDay,
          status: newTimeOfDay === "completed" ? "completed" : "pending",
        })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error

      // Add to history if completed
      if (newTimeOfDay === "completed") {
        await supabase.from("history").insert({
          user_id: data.user_id,
          habit_id: data.id,
          date: data.date,
          status: "completed",
        })
      }

      return data as Habit
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    setOfflineHabits: (state, action: PayloadAction<Habit[]>) => {
      state.items = action.payload
    },
    updateHabitLocally: (state, action: PayloadAction<{ id: string; updates: Partial<Habit> }>) => {
      const { id, updates } = action.payload
      const habitIndex = state.items.findIndex((habit) => habit.id === id)
      if (habitIndex !== -1) {
        state.items[habitIndex] = { ...state.items[habitIndex], ...updates }
      }
    },
    moveHabitLocally: (
      state,
      action: PayloadAction<{ id: string; newTimeOfDay: "morning" | "afternoon" | "evening" | "completed" }>,
    ) => {
      const { id, newTimeOfDay } = action.payload
      const habitIndex = state.items.findIndex((habit) => habit.id === id)
      if (habitIndex !== -1) {
        state.items[habitIndex].time_of_day = newTimeOfDay
        state.items[habitIndex].status = newTimeOfDay === "completed" ? "completed" : "pending"
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
      // fetchHabits
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.lastSynced = new Date().toISOString()
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // addHabit
      .addCase(addHabit.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      // updateHabit
      .addCase(updateHabit.fulfilled, (state, action) => {
        const index = state.items.findIndex((h) => h.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      // deleteHabit
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.items = state.items.filter((h) => h.id !== action.payload)
      })
      // moveHabit
      .addCase(moveHabit.fulfilled, (state, action) => {
        const index = state.items.findIndex((h) => h.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
  },
})

export const { setOfflineHabits, updateHabitLocally, moveHabitLocally, setSyncStatus } = habitsSlice.actions
export default habitsSlice.reducer
