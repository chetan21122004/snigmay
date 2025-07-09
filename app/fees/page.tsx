"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FeeManagement } from "@/components/fee-management"

export default function FeesPage() {
  const [selectedCenter, setSelectedCenter] = useState<string>("all")

  useEffect(() => {
    // Get selected center from localStorage
    const storedCenter = localStorage.getItem("selectedCenter") || "all"
    setSelectedCenter(storedCenter)
  }, [])

  return (
    <DashboardLayout>
      <FeeManagement selectedCenter={selectedCenter} />
    </DashboardLayout>
  )
} 