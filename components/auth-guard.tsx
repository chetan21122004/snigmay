"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, type User, type UserRole } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
  requiredCenter?: string
}

export function AuthGuard({ children, requiredRole, requiredCenter }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
          router.push("/login")
          return
        }

        // Check if user has the required role
        if (requiredRole) {
          const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
          
          // Super admin can access everything
          if (currentUser.role === "super_admin") {
            setUser(currentUser)
            setLoading(false)
            return
          }
          
          if (!roles.includes(currentUser.role)) {
            router.push("/unauthorized")
            return
          }
        }
        
        // Check if user has access to the required center
        if (requiredCenter && currentUser.role !== "super_admin" && 
            currentUser.role !== "club_manager" && currentUser.role !== "head_coach") {
          // Center managers and coaches need to be associated with the center
          if (currentUser.center_id !== requiredCenter) {
            router.push("/unauthorized")
            return
          }
        }

        setUser(currentUser)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, requiredRole, requiredCenter])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
