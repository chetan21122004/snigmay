"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CenterAttendanceManagement } from "@/components/center-attendance-management"

export default function AttendancePage() {
  const [selectedCenter, setSelectedCenter] = useState<string>("all")

  useEffect(() => {
    // Get selected center from localStorage
    const storedCenter = localStorage.getItem("selectedCenter") || "all"
    setSelectedCenter(storedCenter)
  }, [])

  return (
    <DashboardLayout>
      <CenterAttendanceManagement selectedCenter={selectedCenter} />
    </DashboardLayout>
  )
} 