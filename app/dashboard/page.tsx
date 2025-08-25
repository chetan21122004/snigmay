"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { SuperAdminDashboard } from "@/components/super-admin-dashboard"
import { ClubManagerDashboard } from "@/components/club-manager-dashboard"
import { HeadCoachDashboard } from "@/components/head-coach-dashboard"
import { CoachDashboard } from "@/components/coach-dashboard"
import CenterManagerDashboard from "@/components/center-manager-dashboard"
import { useCenterContext } from "@/context/center-context"

export default function DashboardPage() {
  // Get user from center context instead of fetching separately
  const { user, loading } = useCenterContext()

  const renderRoleDashboard = () => {
    if (loading || !user) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-600"></div>
            <p className="text-sm text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      )
    }

    // Debug: Log user role to console
    console.log('Dashboard user role:', user.role, 'User:', user)
    
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
          <div className="flex items-center justify-center min-h-[60vh] p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">Access Denied</h2>
              <p className="mt-2 text-gray-600">Your role does not have dashboard access.</p>
              <p className="mt-1 text-sm text-gray-500">Current role: {user.role}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <DashboardLayout>
      {renderRoleDashboard()}
    </DashboardLayout>
  )
}
