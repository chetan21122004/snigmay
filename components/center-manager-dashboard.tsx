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
import { CenterAttendanceManagement } from "@/components/center-attendance-management"
import { 
  LogOut, 
  Calendar, 
  BarChart3, 
  Users, 
  Building, 
  CreditCard, 
  Clock, 
  ClipboardList,
  UserCheck,
  UserX,
  CalendarDays,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ShieldAlert,
  Info,
  Lock
} from "lucide-react"
import Image from "next/image"

interface Center {
  id: string
  name: string
  location: string
  description?: string
}

interface Batch {
  id: string
  name: string
  description: string | null
  center_id?: string
  coach_id?: string
  coach_name?: string
  time_slot?: string
  age_group?: string
  student_count?: number
}

interface Coach {
  id: string
  full_name: string
  center_id: string
}

interface CenterStats {
  totalStudents: number
  totalBatches: number
  totalCoaches: number
  attendanceToday: number
  attendanceRate: number
  pendingFees: number
  totalRevenue: number
  recentPayments: number
}

export function CenterManagerDashboard() {
  const [center, setCenter] = useState<Center | null>(null)
  const [batches, setBatches] = useState<Batch[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [stats, setStats] = useState<CenterStats>({
    totalStudents: 0,
    totalBatches: 0,
    totalCoaches: 0,
    attendanceToday: 0,
    attendanceRate: 0,
    pendingFees: 0,
    totalRevenue: 0,
    recentPayments: 0
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [accessError, setAccessError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadCenterData()
  }, [])

  const loadCenterData = async () => {
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
      
      // Load center details with strict validation
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
      
      // Load batches for this center with strict filtering
      const { data: batchData, error: batchError } = await supabase
        .from("batches")
        .select(`
          *,
          coaches:coach_id (full_name)
        `)
        .eq("center_id", currentUser.center_id)
        
      if (batchError) throw batchError
      
      // Double-check batches are for this center only
      const centerBatches = batchData?.filter(batch => batch.center_id === currentUser.center_id) || []
      
      // Format batch data with coach names
      const formattedBatches = centerBatches.map(batch => ({
        ...batch,
        coach_name: batch.coaches?.full_name || "Unassigned"
      }))
      
      setBatches(formattedBatches)
      
      // Load coaches for this center with strict filtering
      const { data: coachData, error: coachError } = await supabase
        .from("users")
        .select("*")
        .eq("center_id", currentUser.center_id)
        .eq("role", "coach")
        
      if (coachError) throw coachError
      
      // Double-check coaches are for this center only
      const centerCoaches = coachData?.filter(coach => coach.center_id === currentUser.center_id) || []
      setCoaches(centerCoaches)
      
      // Get center statistics
      await loadCenterStats(currentUser.center_id)
      
    } catch (error) {
      console.error("Error loading center data:", error)
      setAccessError("An error occurred while loading your center data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }
  
  const loadCenterStats = async (centerId: string) => {
    try {
      // Get students count - strict center filtering
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select("id")
        .eq("center_id", centerId)
        
      if (studentsError) throw studentsError
      
      // Get today's attendance - strict center filtering
      const today = new Date().toISOString().split('T')[0]
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("center_id", centerId)
        .eq("date", today)
        
      if (attendanceError) throw attendanceError
      
      const presentCount = attendanceData?.filter(a => a.status === 'present').length || 0
      const totalStudents = studentsData?.length || 0
      const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0
      
      // Get fee statistics - strict center filtering
      const { data: feesData, error: feesError } = await supabase
        .from("fees")
        .select("amount, status")
        .eq("center_id", centerId)
        
      if (feesError) throw feesError
      
      const totalRevenue = feesData?.filter(f => f.status === 'paid')
        .reduce((sum, fee) => sum + (fee.amount || 0), 0) || 0
        
      const pendingFees = feesData?.filter(f => f.status === 'pending')
        .reduce((sum, fee) => sum + (fee.amount || 0), 0) || 0
      
      // Update stats
      setStats({
        totalStudents,
        totalBatches: batches.length,
        totalCoaches: coaches.length,
        attendanceToday: presentCount,
        attendanceRate,
        pendingFees,
        totalRevenue,
        recentPayments: totalRevenue * 0.1 // Simplified for demo
      })
      
    } catch (error) {
      console.error("Error loading center stats:", error)
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
          <p className="text-sm text-muted-foreground">Loading center dashboard...</p>
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
              As a center manager, you can only access data for your assigned center. Please contact your administrator
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
                <h1 className="text-2xl font-bold text-gray-900">Center Manager Dashboard</h1>
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
                  As a center manager, your access is strictly limited to your assigned center.
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Any attempt to access data from other centers will be restricted by the system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Active enrolled students at {center?.location} only
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Training Batches</CardTitle>
              <ClipboardList className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBatches}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Active training groups at {center?.location} only
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
              <UserCheck className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
              <div className="mt-2">
                <Progress value={stats.attendanceRate} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.attendanceToday} present out of {stats.totalStudents} students at {center?.location}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fee Collection</CardTitle>
              <CreditCard className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-muted-foreground">Collection Rate</span>
                <span className={stats.pendingFees > stats.totalRevenue * 0.2 ? "text-red-500" : "text-green-500"}>
                  {stats.totalRevenue > 0 ? Math.round((stats.totalRevenue / (stats.totalRevenue + stats.pendingFees)) * 100) : 0}%
                </span>
              </div>
              <p className="text-xs text-red-500 mt-1">
                ₹{stats.pendingFees.toLocaleString()} pending at {center?.location}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Center Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{center?.location} Center Overview</CardTitle>
                <CardDescription>Details for your assigned center only</CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Center-Specific Data</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Center Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Location:</span>
                    <span className="text-sm font-medium">{center?.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Coaches:</span>
                    <span className="text-sm font-medium">{stats.totalCoaches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Batches:</span>
                    <span className="text-sm font-medium">{stats.totalBatches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Students:</span>
                    <span className="text-sm font-medium">{stats.totalStudents}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Performance Indicators</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Attendance Rate:</span>
                    <div className="flex items-center">
                      {stats.attendanceRate >= 80 ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${stats.attendanceRate >= 80 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.attendanceRate}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fee Collection:</span>
                    <div className="flex items-center">
                      {stats.pendingFees < stats.totalRevenue * 0.2 ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${stats.pendingFees < stats.totalRevenue * 0.2 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.totalRevenue > 0 ? Math.round((stats.totalRevenue / (stats.totalRevenue + stats.pendingFees)) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Student-Coach Ratio:</span>
                    <span className="text-sm font-medium">
                      {stats.totalCoaches > 0 ? Math.round(stats.totalStudents / stats.totalCoaches) : 0}:1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main functionality tabs */}
        <Tabs defaultValue="attendance" className="space-y-6">
          <TabsList className="bg-muted/60">
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Attendance Management
            </TabsTrigger>
            <TabsTrigger value="fees" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Fee Management
            </TabsTrigger>
            <TabsTrigger value="batches" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Batches
            </TabsTrigger>
            <TabsTrigger value="coaches" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Coaches
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Attendance Management</CardTitle>
                    <CardDescription>
                      Monitor and manage attendance for {center?.location} center only
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Center-Specific</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {center?.id ? (
                  <CenterAttendanceManagement selectedCenter={center.id} />
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">Center information is not available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Fee Management</CardTitle>
                    <CardDescription>
                      Manage student fees and payments for {center?.location} center only
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Center-Specific</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-md">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Fee Collection Notice</p>
                      <p className="text-xs text-amber-600 mt-1">
                        There are {Math.round(stats.pendingFees / 1000)} students with pending fees at {center?.location} center.
                      </p>
                    </div>
                  </div>
                  
                  <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-100">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Center-Specific Access</AlertTitle>
                    <AlertDescription>
                      As a Center Manager, you can only view and manage fee records for students at {center?.location} center.
                      You cannot access fee data from other centers.
                    </AlertDescription>
                  </Alert>
                  
                  <p className="text-sm text-muted-foreground">
                    Fee management interface for {center?.location} center will be implemented here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="batches">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Batch Management</CardTitle>
                    <CardDescription>
                      Manage training batches at {center?.location} center only
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Center-Specific</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Alert variant="default" className="mb-4 bg-blue-50 text-blue-800 border-blue-100">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Showing batches for {center?.location} center only. You cannot view or manage batches from other centers.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  {batches.length > 0 ? (
                    batches.slice(0, 5).map((batch) => (
                      <div key={batch.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border">
                        <ClipboardList className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">{batch.name}</p>
                            <Badge variant="outline">{batch.age_group || "Age not specified"}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Coach: {batch.coach_name} • Students: {batch.student_count || "0"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {batch.time_slot || "Schedule not set"}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Center: {center?.location}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground">No batches found for {center?.location} center.</p>
                    </div>
                  )}
                </div>
                
                {batches.length > 5 && (
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    View All {batches.length} Batches at {center?.location}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coaches">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Coach Management</CardTitle>
                    <CardDescription>
                      Manage coaches at {center?.location} center only
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Center-Specific</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Alert variant="default" className="mb-4 bg-blue-50 text-blue-800 border-blue-100">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Showing coaches for {center?.location} center only. You cannot view or manage coaches from other centers.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  {coaches.length > 0 ? (
                    coaches.slice(0, 5).map((coach) => (
                      <div key={coach.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md border">
                        <Users className="h-5 w-5 text-green-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{coach.full_name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Coach ID: {coach.id.substring(0, 8)}...
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Center: {center?.location}
                          </p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground">No coaches found for {center?.location} center.</p>
                    </div>
                  )}
                </div>
                
                {coaches.length > 5 && (
                  <Button variant="ghost" size="sm" className="w-full mt-4">
                    View All {coaches.length} Coaches at {center?.location}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer with center-specific indicator */}
      <footer className="border-t py-4 px-8 text-center text-xs text-muted-foreground mt-8">
        <p className="mb-1">© {new Date().getFullYear()} Snigmay Pune Football Club. All rights reserved.</p>
        <p className="text-xs text-blue-600">
          You are viewing data for {center?.location} center only
        </p>
      </footer>
    </div>
  )
} 