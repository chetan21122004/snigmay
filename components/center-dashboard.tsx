"use client"

import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Building, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserCheck,
  UserX,
  Clock,
  Target
} from "lucide-react"
import { CenterAttendanceManagement } from "@/components/center-attendance-management"

interface Center {
  id: string
  name: string
  location: string
  description: string
}

interface DashboardStats {
  totalStudents: number
  totalBatches: number
  totalCoaches: number
  attendanceToday: number
  attendanceRate: number
  pendingFees: number
  totalRevenue: number
  recentPayments: number
}

interface User {
  id: string
  email: string
  full_name: string
  role: string
  center_id: string | null
}

export function CenterDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [centers, setCenters] = useState<Center[]>([])
  const [selectedCenter, setSelectedCenter] = useState<string>("all")
  const [stats, setStats] = useState<DashboardStats>({
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

  useEffect(() => {
    loadUserAndCenters()
  }, [])

  useEffect(() => {
    // Get selected center from localStorage (set by layout)
    const storedCenter = localStorage.getItem("selectedCenter") || "all"
    setSelectedCenter(storedCenter)
    if (storedCenter) {
      loadDashboardStats(storedCenter)
    }
  }, [])

  const loadUserAndCenters = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      // Fetch centers based on user role
      const response = await fetch('/api/centers')
      const centersData = await response.json()
      setCenters(centersData)

      // Get center from localStorage
      const storedCenter = localStorage.getItem("selectedCenter") || "all"
      setSelectedCenter(storedCenter)
    } catch (error) {
      console.error('Error loading user and centers:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardStats = async (centerId: string) => {
    try {
      const response = await fetch(`/api/dashboard/stats?center=${centerId}`)
      const statsData = await response.json()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    }
  }

  const canAccessCenter = (centerId: string) => {
    if (!user) return false
    
    // Super admin, club manager, and head coach can access all centers
    if (['super_admin', 'club_manager', 'head_coach'].includes(user.role)) {
      return true
    }
    
    // Coach and center manager can only access their assigned center
    if (['coach', 'center_manager'].includes(user.role)) {
      return user.center_id === centerId || centerId === 'all'
    }
    
    return false
  }

  const getFilteredCenters = () => {
    if (!user) return []
    
    if (['super_admin', 'club_manager', 'head_coach'].includes(user.role)) {
      return centers
    }
    
    return centers.filter(center => center.id === user.center_id)
  }

  const getDashboardTitle = () => {
    if (selectedCenter === 'all') {
      return 'All Centers Overview'
    }
    const center = centers.find(c => c.id === selectedCenter)
    return center ? `${center.location} Center` : 'Center Dashboard'
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{getDashboardTitle()}</h1>
        <p className="text-gray-600 mt-1">Football Academy Management Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active enrolled students
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Batches</CardTitle>
            <Target className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBatches}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active training groups
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <UserCheck className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.attendanceToday} present today
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pendingFees} pending payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="fees">Fee Management</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">85% attendance rate this week</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">₹{stats.recentPayments} collected today</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-purple-500" />
                    <span className="text-sm">3 new students enrolled</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-semibold">₹{stats.totalRevenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Fees</span>
                    <span className="font-semibold text-red-500">₹{stats.pendingFees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Collection Rate</span>
                    <span className="font-semibold text-green-500">
                      {((stats.totalRevenue / (stats.totalRevenue + stats.pendingFees)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <CenterAttendanceManagement selectedCenter={selectedCenter} />
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <FeeManagementSection centerId={selectedCenter} />
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <StudentsSection centerId={selectedCenter} />
        </TabsContent>

        <TabsContent value="batches" className="space-y-4">
          <BatchesSection centerId={selectedCenter} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Placeholder components for different sections
function FeeManagementSection({ centerId }: { centerId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Management</CardTitle>
        <CardDescription>Manage student fees and payments</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Fee management interface for center: {centerId}</p>
        {/* This will be implemented with detailed fee management functionality */}
      </CardContent>
    </Card>
  )
}

function StudentsSection({ centerId }: { centerId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Management</CardTitle>
        <CardDescription>Manage student records and information</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Student management interface for center: {centerId}</p>
        {/* This will be implemented with detailed student management functionality */}
      </CardContent>
    </Card>
  )
}

function BatchesSection({ centerId }: { centerId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Management</CardTitle>
        <CardDescription>Manage training batches and schedules</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Batch management interface for center: {centerId}</p>
        {/* This will be implemented with detailed batch management functionality */}
      </CardContent>
    </Card>
  )
} 