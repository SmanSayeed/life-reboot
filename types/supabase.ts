export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          preferred_language: string | null
          theme: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          preferred_language?: string | null
          theme?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          preferred_language?: string | null
          theme?: string | null
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          time_of_day: string
          date: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          time_of_day: string
          date: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          time_of_day?: string
          date?: string
          status?: string
          created_at?: string
        }
      }
      daily_notes: {
        Row: {
          id: string
          user_id: string
          date: string
          note_content: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          note_content?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          note_content?: string | null
          created_at?: string
        }
      }
      history: {
        Row: {
          id: string
          user_id: string
          habit_id: string
          date: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          habit_id: string
          date: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          habit_id?: string
          date?: string
          status?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
