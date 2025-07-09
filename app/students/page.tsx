"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { StudentManagement } from "@/components/student-management"

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <StudentManagement />
    </DashboardLayout>
  )
} 