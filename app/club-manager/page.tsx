"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import CenterProviderWrapper from "@/components/center-provider-wrapper"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { ClubManagerDashboard } from "@/components/club-manager-dashboard"

export default function ClubManagerPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }
      
      if (currentUser.role !== 'club_manager') {
        router.push("/unauthorized")
        return
      }
      
      setUser(currentUser)
    } catch (error) {
      console.error('Error loading user:', error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Loading club manager dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <ClubManagerDashboard />
    </DashboardLayout>
  )
} 