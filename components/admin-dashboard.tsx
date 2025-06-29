"use client"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BatchManagement } from "@/components/batch-management"
import { CoachManagement } from "@/components/coach-management"
import { StudentManagement } from "@/components/student-management"
import { AttendanceReports } from "@/components/attendance-reports"
import { LogOut, Users, GraduationCap, Calendar, BarChart3 } from "lucide-react"

export function AdminDashboard() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Football Academy Management</p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="batches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="batches" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Batches
            </TabsTrigger>
            <TabsTrigger value="coaches" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Coaches
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="batches">
            <Card>
              <CardHeader>
                <CardTitle>Batch Management</CardTitle>
                <CardDescription>Create and manage training batches</CardDescription>
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
                <CardDescription>Manage coach profiles and assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <CoachManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Manage student registrations and batch assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Reports</CardTitle>
                <CardDescription>View and analyze attendance data</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceReports />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
