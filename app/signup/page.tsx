"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUp, getCurrentUser, type UserRole } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<UserRole>("coach")
  const [centerId, setCenterId] = useState<string | undefined>(undefined)
  const [centers, setCenters] = useState<{id: string, name: string}[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    async function checkAuth() {
      const user = await getCurrentUser()
      if (user) {
        router.push("/dashboard")
      }
    }
    checkAuth()
  }, [router])

  // Load centers
  useEffect(() => {
    async function loadCenters() {
      try {
        // Test Supabase connection
        const { data: connectionTest, error: connectionError } = await supabase.from('centers').select('count').limit(1)
        
        if (connectionError) {
          console.error("Supabase connection error:", connectionError)
          setError(`Database connection error: ${connectionError.message}. Please try again later.`)
          return
        }
        
        console.log("Supabase connection successful")
        
        const { data, error } = await supabase
          .from('centers')
          .select('id, name')
          .order('name')
        
        if (error) {
          console.error("Error loading centers:", error)
          setError(`Error loading centers: ${error.message}`)
          return
        }
        
        if (data) {
          console.log("Centers loaded:", data)
          setCenters(data)
          if (data.length > 0) {
            setCenterId(data[0].id)
          }
        }
      } catch (err: any) {
        console.error("Error in loadCenters:", err)
        setError(`Error loading centers: ${err.message || "Unknown error"}`)
      }
    }
    loadCenters()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Client-side validations
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    if (fullName.trim().length < 3) {
      setError("Please enter your full name")
      setLoading(false)
      return
    }

    // Center is required for coaches and center managers
    if ((role === "coach" || role === "center_manager") && !centerId) {
      setError("Please select a center")
      setLoading(false)
      return
    }

    try {
      console.log("Attempting to sign up with:", { email, fullName, role, centerId })
      const { data, error } = await signUp(email, password, fullName, role, centerId)
      console.log("Sign up response:", { data, error })

      if (error) {
        console.error("Signup error:", error)
        setError(error.message || "Failed to create account")
        setLoading(false)
        return
      }

      if (data?.user) {
        console.log("User created successfully:", data.user)
        router.push("/dashboard")
      } else {
        setError("Failed to create account. Please try again.")
        setLoading(false)
      }
    } catch (err: any) {
      console.error("Unexpected error during signup:", err)
      setError(`An unexpected error occurred: ${err.message || "Unknown error"}. Please try again.`)
      setLoading(false)
    }
  }

  // Determine if center selection should be shown
  const showCenterSelection = role === "coach" || role === "center_manager"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Snigmay Pune FC</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="center_manager">Center Manager</SelectItem>
                  <SelectItem value="head_coach">Head Coach</SelectItem>
                  <SelectItem value="club_manager">Club Manager</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Note: Admin accounts may require additional verification
              </p>
            </div>

            {showCenterSelection && (
              <div className="space-y-2">
                <Label htmlFor="center">Center</Label>
                <Select value={centerId} onValueChange={setCenterId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a center" />
                  </SelectTrigger>
                  <SelectContent>
                    {centers.map((center) => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 