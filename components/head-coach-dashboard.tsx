"use client"

import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { BatchManagement } from "./batch-management"
import { CoachManagement } from "./coach-management"
import { AttendanceReports } from "./attendance-reports"
import { CoachAttendanceHistory } from "./coach-attendance-history"

export function HeadCoachDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }
    
    loadUser()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Head Coach Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Batches</CardTitle>
            <CardDescription>Across all centers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">--</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Coaches</CardTitle>
            <CardDescription>Active coaches</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">--</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Students</CardTitle>
            <CardDescription>Across all centers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">--</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="batches">
        <TabsList className="mb-4">
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="coaches">Coaches</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="batches">
          <Card>
            <CardHeader>
              <CardTitle>Batch Management</CardTitle>
              <CardDescription>
                View and manage training batches across all centers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BatchManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="coaches">
          <Card>
            <CardHeader>
              <CardTitle>Coach Management</CardTitle>
              <CardDescription>
                View and manage coaches across all centers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CoachManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Coach Attendance History</CardTitle>
              <CardDescription>
                View attendance records marked by coaches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CoachAttendanceHistory />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
              <CardDescription>
                View attendance reports and statistics across all centers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceReports />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 