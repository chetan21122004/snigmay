import { supabase } from "./supabase"
import type { Database } from "./supabase"
import { v4 as uuidv4 } from "uuid"
import * as bcrypt from "bcryptjs"

export type User = Database["public"]["Tables"]["users"]["Row"]

// Helper function to hash passwords
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Helper function to verify passwords
async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Helper function to generate a session token
function generateToken(): string {
  return uuidv4()
}

export async function getCurrentUser(): Promise<User | null> {
  // Get token from localStorage (client-side only)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("session_token")
    
    if (!token) return null
    
    // Verify token in database
    const { data: session } = await supabase
      .from("sessions")
      .select("user_id, expires_at")
      .eq("token", token)
      .single()
    
    if (!session) {
      // Token not found or invalid
      localStorage.removeItem("session_token")
      return null
    }
    
    // Check if token is expired
    if (new Date(session.expires_at) < new Date()) {
      // Token expired
      await supabase.from("sessions").delete().eq("token", token)
      localStorage.removeItem("session_token")
      return null
    }
    
    // Get user data
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user_id)
      .single()
    
    return userData
  }
  
  return null
}

export async function signIn(email: string, password: string) {
  try {
    // Find user by email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single()
    
    if (userError || !user) {
      return { data: { user: null }, error: { message: "Invalid email or password" } }
    }
    
    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash)
    
    if (!isPasswordValid) {
      return { data: { user: null }, error: { message: "Invalid email or password" } }
    }
    
    // Create a new session
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Token expires in 7 days
    
    const { error: sessionError } = await supabase
      .from("sessions")
      .insert({
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString(),
      })
    
    if (sessionError) {
      return { data: { user: null }, error: { message: "Failed to create session" } }
    }
    
    // Save token to localStorage (client-side only)
    if (typeof window !== "undefined") {
      localStorage.setItem("session_token", token)
    }
    
    // Return user data without password
    const { password_hash, ...userData } = user
    return { data: { user: userData }, error: null }
  } catch (err) {
    console.error("Sign in error:", err)
    return { data: { user: null }, error: { message: "An unexpected error occurred" } }
  }
}

export async function signOut() {
  try {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("session_token")
      
      if (token) {
        // Delete session from database
        await supabase.from("sessions").delete().eq("token", token)
        
        // Remove token from localStorage
        localStorage.removeItem("session_token")
      }
    }
    
    return { error: null }
  } catch (err) {
    console.error("Sign out error:", err)
    return { error: { message: "Failed to sign out" } }
  }
}

export async function signUp(email: string, password: string, fullName: string, role: "admin" | "coach" = "coach") {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .single()
    
    if (existingUser) {
      return { data: { user: null }, error: { message: "Email already in use" } }
    }
    
    // Hash password
    const passwordHash = await hashPassword(password)
    
    // Create user
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        full_name: fullName,
        role,
      })
      .select()
      .single()
    
    if (userError || !userData) {
      return { data: { user: null }, error: { message: "Failed to create user" } }
    }
    
    // Create session
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Token expires in 7 days
    
    const { error: sessionError } = await supabase
      .from("sessions")
      .insert({
        user_id: userData.id,
        token,
        expires_at: expiresAt.toISOString(),
      })
    
    if (sessionError) {
      return { data: { user: userData }, error: { message: "User created but failed to create session" } }
    }
    
    // Save token to localStorage (client-side only)
    if (typeof window !== "undefined") {
      localStorage.setItem("session_token", token)
    }
    
    // Return user data without password
    const { password_hash, ...user } = userData
    return { data: { user }, error: null }
  } catch (err) {
    console.error("Sign up error:", err)
    return { data: { user: null }, error: { message: "An unexpected error occurred" } }
  }
}
