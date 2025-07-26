"use client"
import DashboardLayout from "@/components/dashboard-layout"
import BatchManagement from "@/components/batch-management"
import CenterProviderWrapper from "@/components/center-provider-wrapper"

export default function BatchesPage() {
  return (
    <CenterProviderWrapper>
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <BatchManagement />
          </div>
        </div>
      </DashboardLayout>
    </CenterProviderWrapper>
  )
} 