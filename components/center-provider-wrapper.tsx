"use client"

import { useEffect, useState } from "react"
import { CenterProvider } from "@/context/center-context"
import { getCurrentUser } from "@/lib/auth"
import { Skeleton } from "@/components/ui/skeleton"

interface User {
  id: string
  email: string
  full_name: string
  role: string
  center_id: string | null
}

interface CenterProviderWrapperProps {
  children: React.ReactNode
}

export function CenterProviderWrapper({ children }: CenterProviderWrapperProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-6 w-full max-w-4xl mx-auto p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <CenterProvider user={user}>
      {children}
    </CenterProvider>
  )
} 