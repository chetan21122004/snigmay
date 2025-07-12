"use client"

import { useState, useEffect } from "react"
import { signOut, getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AttendanceMarking } from "@/components/attendance-marking"
import { CoachAttendanceHistory } from "@/components/coach-attendance-history"
import { 
  LogOut, 
  Calendar, 
  BarChart3, 
  Users, 
  Building, 
  Clock, 
  CheckCircle2, 
  UserCheck, 
  CalendarDays,
  ClipboardList,
  ShieldAlert,
  Info,
  Lock
} from "lucide-react"
import Image from "next/image"

interface Batch {
  id: string
  name: string
  description: string | null
  center_id?: string
  time_slot?: string
  age_group?: string
  day_of_week?: string[]
}

interface Center {
  id: string
  name: string
  location: string
}

interface Student {
  id: string
  full_name: string
  center_id: string
}

export function CoachDashboard() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [center, setCenter] = useState<Center | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceStats, setAttendanceStats] = useState({
    today: 0,
    total: 0,
    rate: 0
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [accessError, setAccessError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/login")
        return
      }
      
      setUser(currentUser)
      
      // Strict center access check
      if (!currentUser.center_id) {
        setAccessError("You do not have an assigned center. Please contact an administrator.")
        setLoading(false)
        return
      }
      
      // Load center details
      const { data: centerData, error: centerError } = await supabase
        .from("centers")
        .select("*")
        .eq("id", currentUser.center_id)
        .single()
        
      if (centerError) {
        setAccessError("Unable to load your assigned center details. Please contact an administrator.")
        setLoading(false)
        return
      }
      
      setCenter(centerData)
      
      // Load batches assigned to this coach at their center - strict filtering
      const { data: batchData, error: batchError } = await supabase
        .from("batches")
        .select("*")
        .eq("coach_id", currentUser.id)
        .eq("center_id", currentUser.center_id)
        
      if (batchError) throw batchError
      
      // Ensure we only have batches for this center
      const centerBatches = batchData?.filter(batch => batch.center_id === currentUser.center_id) || []
      setBatches(centerBatches)
      
      // Load students in coach's batches - with center verification
      if (centerBatches.length > 0) {
        const batchIds = centerBatches.map(batch => batch.id)
        
        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("*")
          .in("batch_id", batchIds)
          .eq("center_id", currentUser.center_id) // Additional center filter for students
          
        if (studentError) throw studentError
        
        // Double-check students belong to this center
        const centerStudents = studentData?.filter(student => student.center_id === currentUser.center_id) || []
        setStudents(centerStudents)
        
        // Get today's attendance stats - with center verification
        const today = new Date().toISOString().split('T')[0]
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance")
          .select("*")
          .in("batch_id", batchIds)
          .eq("date", today)
          .eq("center_id", currentUser.center_id) // Additional center filter for attendance
          
        if (attendanceError) throw attendanceError
        
        const presentCount = attendanceData?.filter(a => a.status === 'present').length || 0
        const totalStudents = centerStudents.length
        
        setAttendanceStats({
          today: presentCount,
          total: totalStudents,
          rate: totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0
        })
      }
    } catch (error) {
      console.error("Error loading coach data:", error)
      setAccessError("An error occurred while loading your data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading coach dashboard...</p>
        </div>
      </div>
    )
  }

  if (accessError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-6 w-6 text-red-500" />
              <CardTitle>Access Restricted</CardTitle>
            </div>
            <CardDescription>Center-specific access issue</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Access Error
              </AlertTitle>
              <AlertDescription>{accessError}</AlertDescription>
            </Alert>
            <p className="mt-4 text-sm text-muted-foreground">
              As a coach, you can only access data for your assigned center. Please contact your administrator
              if you believe this is an error.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSignOut} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block">
                <Image 
                  src="/placeholder-logo.svg" 
                  alt="Snigmay Pune FC Logo" 
                  width={40} 
                  height={40} 
                  className="rounded-full"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Coach Dashboard</h1>
                <div className="flex items-center mt-1">
                  <Badge variant="outline" className="pl-1 pr-2 py-0 flex items-center gap-1 border-green-200 bg-green-50">
                    <Building className="h-3 w-3 text-green-600" />
                    <span className="text-green-700">{center?.location || "Assigned Center"}</span>
                  </Badge>
                </div>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Center-specific notice - Enhanced */}
        <Card className="mb-8 bg-blue-50 border-blue-100">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-800">Center-Specific Access Only</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Access Restriction:</strong> You are viewing data for <strong>{center?.location}</strong> center only. 
                  As a coach, your access is strictly limited to your assigned center and batches.
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Any attempt to access data from other centers will be restricted by the system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Batches</CardTitle>
              <ClipboardList className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{batches.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Assigned training batches at {center?.location}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Students</CardTitle>
              <Users className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Students enrolled in your batches at {center?.location}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
              <UserCheck className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats.rate}%</div>
              <div className="mt-2">
                <Progress value={attendanceStats.rate} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {attendanceStats.today} present out of {attendanceStats.total} students at {center?.location}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming sessions - simplified calendar view */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Sessions at {center?.location}</CardTitle>
              <CardDescription>Your scheduled training sessions at this center</CardDescription>
            </div>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {batches.length > 0 ? (
              <div className="space-y-4">
                {batches.slice(0, 3).map((batch) => (
                  <div key={batch.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border">
                    <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{batch.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {batch.time_slot || "Schedule not set"} • {batch.age_group || "Age group not specified"}
                      </p>
                      <p className="text-xs text-blue-600">
                        Center: {center?.location}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {batch.day_of_week ? batch.day_of_week.join(", ") : "Days not set"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No batches assigned at {center?.location} center.</p>
              </div>
            )}
          </CardContent>
          {batches.length > 3 && (
            <CardFooter className="border-t pt-4">
              <Button variant="ghost" size="sm" className="w-full">
                View All {batches.length} Batches at {center?.location}
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Main functionality tabs */}
        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList className="bg-muted/60">
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
                <CardDescription>
                  Select a batch and mark student attendance for {center?.location} center only
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceMarking 
                  batches={batches} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>
                  View attendance records for your batches at {center?.location} center only
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CoachAttendanceHistory 
                  batches={batches.map((batch) => batch.id)} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-4 px-8 text-center text-xs text-muted-foreground mt-8">
        <p>© {new Date().getFullYear()} Snigmay Pune Football Club. All rights reserved.</p>
      </footer>
    </div>
  )
}
