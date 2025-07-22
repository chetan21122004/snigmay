"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { CenterProviderWrapper } from "@/components/center-provider-wrapper"
import { BatchManagement } from "@/components/batch-management"

export default function BatchesPage() {
  return (
    <CenterProviderWrapper>
      <DashboardLayout>
        <BatchManagement />
      </DashboardLayout>
    </CenterProviderWrapper>
  )
} 