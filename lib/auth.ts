import { supabase } from "./supabase"
import type { Database } from "./supabase"

export type User = Database["public"]["Tables"]["users"]["Row"]

export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  return userData
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function signUp(email: string, password: string, fullName: string, role: "admin" | "coach" = "coach") {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (data.user && !error) {
    // Insert user profile
    const { error: profileError } = await supabase.from("users").insert({
      id: data.user.id,
      email,
      full_name: fullName,
      role,
    })

    if (profileError) {
      console.error("Error creating user profile:", profileError)
    }
  }

  return { data, error }
}
