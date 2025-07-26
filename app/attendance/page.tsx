"use client"
import DashboardLayout from "@/components/dashboard-layout"
import CenterAttendanceManagement from "@/components/center-attendance-management"
import CenterProviderWrapper from "@/components/center-provider-wrapper"

export default function AttendancePage() {
  return (
    <CenterProviderWrapper>
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <CenterAttendanceManagement />
          </div>
        </div>
      </DashboardLayout>
    </CenterProviderWrapper>
  )
} 