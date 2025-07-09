import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nqkpmwdmlkcelorvqyyl.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xa3Btd2RtbGtjZWxvcnZxeXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1NTMzMTIsImV4cCI6MjAzNjEyOTMxMn0.Bq7Hf9kHBWKlQZbGlXQgVe4Yl1M-Ww8KLJiSJQQTpnc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string
          role: "super_admin" | "club_manager" | "head_coach" | "coach" | "center_manager"
          center_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name: string
          role?: "super_admin" | "club_manager" | "head_coach" | "coach" | "center_manager"
          center_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string
          role?: "super_admin" | "club_manager" | "head_coach" | "coach" | "center_manager"
          center_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      centers: {
        Row: {
          id: string
          name: string
          location: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          description?: string | null
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
          center_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          coach_id?: string | null
          center_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          coach_id?: string | null
          center_id?: string | null
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
          status: "present" | "absent" | "late"
          marked_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          batch_id: string
          date: string
          status: "present" | "absent" | "late"
          marked_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          batch_id?: string
          date?: string
          status?: "present" | "absent" | "late"
          marked_by?: string | null
          created_at?: string
        }
      }
      fee_structures: {
        Row: {
          id: string
          batch_id: string
          amount: number
          frequency: "monthly" | "quarterly" | "annually"
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          batch_id: string
          amount: number
          frequency: "monthly" | "quarterly" | "annually"
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          batch_id?: string
          amount?: number
          frequency?: "monthly" | "quarterly" | "annually"
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fee_payments: {
        Row: {
          id: string
          student_id: string
          amount: number
          payment_date: string
          payment_mode: "cash" | "upi" | "bank_transfer" | "check"
          receipt_number: string | null
          status: "paid" | "due" | "overdue"
          due_date: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          amount: number
          payment_date: string
          payment_mode: "cash" | "upi" | "bank_transfer" | "check"
          receipt_number?: string | null
          status: "paid" | "due" | "overdue"
          due_date?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          amount?: number
          payment_date?: string
          payment_mode?: "cash" | "upi" | "bank_transfer" | "check"
          receipt_number?: string | null
          status?: "paid" | "due" | "overdue"
          due_date?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          expires_at?: string
          created_at?: string
        }
      }
    }
  }
}
