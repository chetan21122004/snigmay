"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SuperAdminDashboard } from "@/components/super-admin-dashboard"
import { ClubManagerDashboard } from "@/components/club-manager-dashboard"
import { HeadCoachDashboard } from "@/components/head-coach-dashboard"
import { CoachDashboard } from "@/components/coach-dashboard"
import { CenterManagerDashboard } from "@/components/center-manager-dashboard"
import { CenterProviderWrapper } from "@/components/center-provider-wrapper"

interface User {
  id: string
  email: string
  full_name: string
  role: string
  center_id: string | null
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

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

  const renderRoleDashboard = () => {
    if (!user) return null

    switch (user.role) {
      case 'super_admin':
        return <SuperAdminDashboard />
      case 'club_manager':
        return <ClubManagerDashboard />
      case 'head_coach':
        return <HeadCoachDashboard />
      case 'coach':
        return <CoachDashboard />
      case 'center_manager':
        return <CenterManagerDashboard />
      default:
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">Access Denied</h2>
              <p className="mt-2 text-gray-600">Your role does not have dashboard access.</p>
            </div>
          </div>
        )
    }
  }

  if (loading) {
    return <CenterProviderWrapper><div /></CenterProviderWrapper>
  }

  return (
    <CenterProviderWrapper>
      <DashboardLayout>
        {renderRoleDashboard()}
      </DashboardLayout>
    </CenterProviderWrapper>
  )
}
