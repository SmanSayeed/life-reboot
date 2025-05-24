export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          preferred_language: string
          theme: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          preferred_language?: string
          theme?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          preferred_language?: string
          theme?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          date: string
          time_of_day: 'morning' | 'afternoon' | 'evening'
          status: 'pending' | 'completed' | 'skipped'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          date: string
          time_of_day: 'morning' | 'afternoon' | 'evening'
          status?: 'pending' | 'completed' | 'skipped'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          date?: string
          time_of_day?: 'morning' | 'afternoon' | 'evening'
          status?: 'pending' | 'completed' | 'skipped'
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          date: string
          scheduled_time: string | null
          status: 'todo' | 'in_progress' | 'done'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          date: string
          scheduled_time?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          date?: string
          scheduled_time?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          created_at?: string
          updated_at?: string
        }
      }
      daily_notes: {
        Row: {
          id: string
          user_id: string
          date: string
          note_content: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          note_content?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          note_content?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      history: {
        Row: {
          id: string
          user_id: string
          habit_id: string
          date: string
          status: 'pending' | 'completed' | 'skipped'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          habit_id: string
          date: string
          status: 'pending' | 'completed' | 'skipped'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          habit_id?: string
          date?: string
          status?: 'pending' | 'completed' | 'skipped'
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