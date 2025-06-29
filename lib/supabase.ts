import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: "admin" | "coach"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: "admin" | "coach"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: "admin" | "coach"
          created_at?: string
          updated_at?: string
        }
      }
      batches: {
        Row: {
          id: string
          name: string
          description: string | null
          coach_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          coach_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          coach_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          name: string
          age: number
          contact_info: string | null
          batch_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          age: number
          contact_info?: string | null
          batch_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          age?: number
          contact_info?: string | null
          batch_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          batch_id: string
          date: string
          status: "present" | "absent"
          marked_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          batch_id: string
          date: string
          status: "present" | "absent"
          marked_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          batch_id?: string
          date?: string
          status?: "present" | "absent"
          marked_by?: string | null
          created_at?: string
        }
      }
    }
  }
}
