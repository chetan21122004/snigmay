"use client"

import { useState, useEffect } from "react"
import { signOut, getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceMarking } from "@/components/attendance-marking"
import { CoachAttendanceHistory } from "@/components/coach-attendance-history"
import { LogOut, Calendar, BarChart3 } from "lucide-react"

interface Batch {
  id: string
  name: string
  description: string | null
}

export function CoachDashboard() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadBatches()
  }, [])

  const loadBatches = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) return

      const { data, error } = await supabase.from("batches").select("*").eq("coach_id", user.id)

      if (error) throw error
      setBatches(data || [])
    } catch (error) {
      console.error("Error loading batches:", error)
    } finally {
      setLoading(false)
    }
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Coach Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your batches and attendance</p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
            <Button onClick={() => router.push('/change-password')} variant="outline" className="ml-2">
              Change Password
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{batches.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Mark Attendance
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Attendance History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Mark Attendance</CardTitle>
                <CardDescription>Select a batch and mark student attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceMarking batches={batches} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>View attendance records for your batches</CardDescription>
              </CardHeader>
              <CardContent>
                <CoachAttendanceHistory batches={batches} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
