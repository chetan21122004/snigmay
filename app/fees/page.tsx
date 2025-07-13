"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { FeeManagement } from "@/components/fee-management"

export default function FeesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Fee Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Comprehensive student fee tracking and payment management
            </p>
          </div>
        </div>
        
        <FeeManagement selectedCenter="all" />
      </div>
    </DashboardLayout>
  )
} 