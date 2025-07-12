"use client"

import { useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { getCurrentUser, type User } from "@/lib/auth"

interface AuthGuardProps {
  children: ReactNode
  requiredRoles?: string[]
}

export function AuthGuard({ children, requiredRoles = [] }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser()
        
        if (!currentUser) {
          router.push("/login")
          return
        }
        
        setUser(currentUser)
        
        // Check if user has required role
        if (requiredRoles.length > 0 && !requiredRoles.includes(currentUser.role)) {
          router.push("/unauthorized")
          return
        }
        
        setAuthorized(true)
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/login")
      } finally {
        // Add a small delay to ensure smooth transitions
        setTimeout(() => setLoading(false), 500)
      }
    }
    
    checkAuth()
  }, [router, requiredRoles])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <Image 
              src="/placeholder-logo.svg" 
              alt="Snigmay Pune FC Logo" 
              width={80} 
              height={80} 
              className="rounded-full bg-white p-2 shadow-md"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#0e4c92] mb-2">Snigmay Pune FC</h1>
          <div className="flex justify-center mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0e4c92]"></div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null // This prevents flash of unauthorized content
  }

  return <>{children}</>
}
