"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signIn, getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error } = await signIn(email, password)

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (data?.user) {
        router.push("/dashboard")
      } else {
        setError("Failed to login. Please try again.")
        setLoading(false)
      }
    } catch (err) {
      console.error("Unexpected error during login:", err)
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green-50 to-blue-50">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-[#0e4c92] flex-col justify-center items-center p-8 text-white">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <Image 
              src="/placeholder-logo.svg" 
              alt="Snigmay Pune FC Logo" 
              width={120} 
              height={120} 
              className="rounded-full bg-white p-2"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4">Snigmay Pune FC</h1>
          <p className="text-xl mb-6">Football Academy Management System</p>
          <div className="space-y-4 text-left">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mr-4">
                <span className="font-bold">1</span>
              </div>
              <p>Centralized attendance tracking across all centers</p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mr-4">
                <span className="font-bold">2</span>
              </div>
              <p>Streamlined fee management and payment tracking</p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center mr-4">
                <span className="font-bold">3</span>
              </div>
              <p>Comprehensive student and batch management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2 md:hidden">
              <Image 
                src="/placeholder-logo.svg" 
                alt="Snigmay Pune FC Logo" 
                width={80} 
                height={80} 
              />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#0e4c92] hover:bg-blue-800" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Demo Accounts:
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p><span className="font-semibold">Super Admin:</span> admin@snigmaypune.com / password123</p>
                <p><span className="font-semibold">HeadCoach:</span> headcoach@snigmaypune.com / password123</p>
                <p><span className="font-semibold">Club Manager:</span> clubman@snigmaypune.com / password123</p>

                <p><span className="font-semibold">Coach:</span> coach@hadapsar.com / password123</p>
                <p><span className="font-semibold">Coach:</span> coach@kharadi.com / password123</p>
                <p><span className="font-semibold">Coach:</span> coach@vimannagar.com / password123</p>

                <p><span className="font-semibold">Center Manager:</span> centerman@kharadi.com / password123</p>
                <p><span className="font-semibold">Center Manager:</span> centerman@hadapsar.com / password123</p>
                <p><span className="font-semibold">Center Manager:</span> centerman@vimannagar.com / password123</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            <p>Contact administrator for account issues</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
