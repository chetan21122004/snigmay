"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { FinanceManagement } from "@/components/finance-management"

export default function FeesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fee Management</h1>
            <p className="text-muted-foreground">
              Comprehensive student fee tracking and payment management
            </p>
          </div>
        </div>
        
        <FinanceManagement />
      </div>
    </DashboardLayout>
  )
} 