"use client"

import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { BatchManagement } from "./batch-management"
import { StudentManagement } from "./student-management"
import { AttendanceReports } from "./attendance-reports"

export function ClubManagerDashboard() {
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
      <h1 className="text-3xl font-bold mb-6">Club Manager Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Centers</CardTitle>
            <CardDescription>Active training centers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3</p>
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
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹--</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="centers">
        <TabsList className="mb-4">
          <TabsTrigger value="centers">Centers</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="centers">
          <Card>
            <CardHeader>
              <CardTitle>Center Management</CardTitle>
              <CardDescription>
                View and manage all training centers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Center management interface will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
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
        
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>
                View and manage students across all centers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudentManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance">
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
        
        <TabsContent value="finances">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>
                View fee collection and financial reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Financial reporting interface will be implemented here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 