"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { CenterProviderWrapper } from "@/components/center-provider-wrapper"
import { CenterAttendanceManagement } from "@/components/center-attendance-management"

export default function AttendancePage() {
  return (
    <CenterProviderWrapper>
    <DashboardLayout>
        <CenterAttendanceManagement />
    </DashboardLayout>
    </CenterProviderWrapper>
  )
} 