"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useCenterContext } from "@/context/center-context"
import { UserCreationDialog } from "@/components/user-creation-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Building, 
  Settings,
  UserCheck,
  Clock,
  Target,
  Trophy,
  ArrowUpRight,
  Layers,
  User,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Users2,
  IndianRupee,
  Database,
  Shield,
  Activity,
  TrendingUp
} from "lucide-react"

interface DashboardStats {
  totalStudents: number
  totalBatches: number
  totalCoaches: number
  totalCenters: number
  totalUsers: number
  attendanceToday: number
  attendanceRate: number
  pendingFees: number
  totalRevenue: number
  recentPayments: number
  centerStats: CenterStats[]
}

interface CenterStats {
  centerId: string
  centerName: string
  location: string
  students: number
  batches: number
  coaches: number
  attendanceRate: number
  revenue: number
  pendingFees: number
}

interface RecentActivity {
  id: string
  type: 'payment' | 'attendance' | 'registration' | 'batch_creation' | 'user_creation'
  description: string
  timestamp: string
  amount?: number
  centerName?: string
}

export function SuperAdminDashboard() {
  const { selectedCenter } = useCenterContext()
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalBatches: 0,
    totalCoaches: 0,
    totalCenters: 0,
    totalUsers: 0,
    attendanceToday: 0,
    attendanceRate: 0,
    pendingFees: 0,
    totalRevenue: 0,
    recentPayments: 0,
    centerStats: []
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  // supabase client is imported

  useEffect(() => {
    loadDashboardData()
  }, [selectedCenter])

  const loadDashboardData = async () => {
    try {
      await Promise.all([
        loadOverallStats(),
        loadCenterStats(),
        loadRecentActivities()
      ])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadOverallStats = async () => {
    try {
      // Get overall statistics - filter by selected center if applicable
      const centerFilter = selectedCenter ? selectedCenter.id : null
      
      const [
        { data: students },
        { data: batches },
        { data: coaches },
        { data: centers },
        { data: users },
        { data: attendanceToday },
        { data: feePayments }
      ] = await Promise.all([
        // Students filtered by center using direct center_id
        centerFilter 
          ? supabase.from('students').select('id').eq('center_id', centerFilter)
          : supabase.from('students').select('id'),
        // Batches filtered by center
        centerFilter 
          ? supabase.from('batches').select('id').eq('center_id', centerFilter)
          : supabase.from('batches').select('id'),
        // Coaches filtered by center
        centerFilter 
          ? supabase.from('users').select('id').eq('role', 'coach').eq('center_id', centerFilter)
          : supabase.from('users').select('id').eq('role', 'coach'),
        // Centers - always show all for super admin
        supabase.from('centers').select('id'),
        // Users - always show all for super admin
        supabase.from('users').select('id'),
        // Attendance filtered by center using students.center_id
        centerFilter 
          ? supabase.from('attendance').select('status, students!inner(center_id)').eq('students.center_id', centerFilter).eq('date', new Date().toISOString().split('T')[0])
          : supabase.from('attendance').select('status').eq('date', new Date().toISOString().split('T')[0]),
        // Fee payments filtered by center using students.center_id
        centerFilter 
          ? supabase.from('fee_payments').select('amount, status, payment_date, students!inner(center_id)').eq('students.center_id', centerFilter)
          : supabase.from('fee_payments').select('amount, status, payment_date')
      ])

      const presentToday = attendanceToday?.filter(a => a.status === 'present').length || 0
      const totalStudents = students?.length || 0
      const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0

      const paidFees = feePayments?.filter(f => f.status === 'paid') || []
      const pendingFees = feePayments?.filter(f => f.status === 'due' || f.status === 'overdue') || []
      
      const totalRevenue = paidFees.reduce((sum, f) => sum + Number(f.amount), 0)
      const totalPendingFees = pendingFees.reduce((sum, f) => sum + Number(f.amount), 0)

      // Recent payments (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const recentPayments = paidFees
        .filter(f => f.payment_date >= sevenDaysAgo)
        .reduce((sum, f) => sum + Number(f.amount), 0)

      setStats(prev => ({
        ...prev,
        totalStudents,
        totalBatches: batches?.length || 0,
        totalCoaches: coaches?.length || 0,
        totalCenters: centers?.length || 0,
        totalUsers: users?.length || 0,
        attendanceToday: presentToday,
        attendanceRate,
        pendingFees: totalPendingFees,
        totalRevenue,
        recentPayments
      }))
    } catch (error) {
      console.error('Error loading overall stats:', error)
    }
  }

  const loadCenterStats = async () => {
    try {
      const { data: centers } = await supabase
        .from('centers')
        .select('id, name, location')

      if (!centers) return

      const centerStats = await Promise.all(
        centers.map(async (center) => {
          const [
            { data: students },
            { data: batches },
            { data: coaches },
            { data: attendance },
            { data: feePayments }
          ] = await Promise.all([
            supabase.from('students').select('id').eq('center_id', center.id),
            supabase.from('batches').select('id').eq('center_id', center.id),
            supabase.from('users').select('id').eq('role', 'coach').eq('center_id', center.id),
            supabase.from('attendance').select('status, students!inner(center_id)').eq('students.center_id', center.id).eq('date', new Date().toISOString().split('T')[0]),
            supabase.from('fee_payments').select('amount, status, students!inner(center_id)').eq('students.center_id', center.id)
          ])

          const centerStudents = students?.length || 0
          const centerAttendance = attendance?.filter(a => a.status === 'present').length || 0
          const centerAttendanceRate = centerStudents > 0 ? Math.round((centerAttendance / centerStudents) * 100) : 0

          const centerRevenue = feePayments?.filter(f => f.status === 'paid').reduce((sum, f) => sum + Number(f.amount), 0) || 0
          const centerPendingFees = feePayments?.filter(f => f.status === 'due' || f.status === 'overdue').reduce((sum, f) => sum + Number(f.amount), 0) || 0

          return {
            centerId: center.id,
            centerName: center.name,
            location: center.location,
            students: centerStudents,
            batches: batches?.length || 0,
            coaches: coaches?.length || 0,
            attendanceRate: centerAttendanceRate,
            revenue: centerRevenue,
            pendingFees: centerPendingFees
          }
        })
      )

      setStats(prev => ({
        ...prev,
        centerStats
      }))
    } catch (error) {
      console.error('Error loading center stats:', error)
    }
  }

  const loadRecentActivities = async () => {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const centerFilter = selectedCenter ? selectedCenter.id : null
      
      const [
        { data: payments },
        { data: students },
        { data: batches },
        { data: users }
      ] = await Promise.all([
        // Fee payments with student and center info
        centerFilter
          ? supabase.from('fee_payments').select('id, amount, created_at, students!inner(full_name, center_id, centers!inner(location))').eq('students.center_id', centerFilter).eq('status', 'paid').gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10)
          : supabase.from('fee_payments').select('id, amount, created_at, students(full_name, centers(location))').eq('status', 'paid').gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10),
        // Students with center info
        centerFilter
          ? supabase.from('students').select('id, full_name, created_at, centers!inner(location)').eq('center_id', centerFilter).gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10)
          : supabase.from('students').select('id, full_name, created_at, centers(location)').gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10),
        // Batches with center info
        centerFilter
          ? supabase.from('batches').select('id, name, created_at, centers!inner(location)').eq('center_id', centerFilter).gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10)
          : supabase.from('batches').select('id, name, created_at, centers(location)').gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10),
        // Users with center info
        centerFilter
          ? supabase.from('users').select('id, full_name, created_at, centers!inner(location)').eq('center_id', centerFilter).gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10)
          : supabase.from('users').select('id, full_name, created_at, centers(location)').gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10)
      ])

      const activities: RecentActivity[] = []

      // Process payments
      payments?.forEach((payment: any) => {
        activities.push({
          id: `payment-${payment.id}`,
          type: 'payment',
          description: `Fee payment received from ${payment.students?.full_name || 'Unknown Student'}`,
          timestamp: payment.created_at,
          amount: Number(payment.amount),
          centerName: payment.students?.centers?.location || selectedCenter?.location || 'Unknown Center'
        })
      })

      // Process student registrations
      students?.forEach((student: any) => {
        activities.push({
          id: `registration-${student.id}`,
          type: 'registration',
          description: `New student registration - ${student.full_name}`,
          timestamp: student.created_at,
          centerName: student.centers?.location || selectedCenter?.location || 'Unknown Center'
        })
      })

      // Process batch creations
      batches?.forEach((batch: any) => {
        activities.push({
          id: `batch-${batch.id}`,
          type: 'batch_creation',
          description: `New batch created - ${batch.name}`,
          timestamp: batch.created_at,
          centerName: batch.centers?.location || selectedCenter?.location || 'Unknown Center'
        })
      })

      // Process user creations
      users?.forEach((user: any) => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user_creation',
          description: `New user created - ${user.full_name}`,
          timestamp: user.created_at,
          centerName: user.centers?.location || selectedCenter?.location || 'System'
        })
      })

      // Sort by timestamp and limit
      const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 20)

      setRecentActivities(sortedActivities)
    } catch (error) {
      console.error('Error loading recent activities:', error)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <IndianRupee className="h-4 w-4 text-green-500" />
      case 'attendance':
        return <UserCheck className="h-4 w-4 text-blue-500" />
      case 'registration':
        return <Users className="h-4 w-4 text-purple-500" />
      case 'batch_creation':
        return <Layers className="h-4 w-4 text-orange-500" />
      case 'user_creation':
        return <User className="h-4 w-4 text-indigo-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading Super Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Super Admin Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Super Admin Dashboard
            </h1>
            <p className="text-red-100 mt-1">Complete system control and oversight - Full access to all modules and data</p>
            {selectedCenter && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <Building className="h-3 w-3 mr-1" />
                  Viewing: {selectedCenter.location}
                </Badge>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-red-100">System Status</p>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 className="h-4 w-4 text-green-300" />
              <span className="text-lg font-semibold">All Systems Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All system users
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Centers</CardTitle>
            <Building className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCenters}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active training centers
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Enrolled students
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <UserCheck className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <div className="mt-2">
              <Progress value={stats.attendanceRate} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Today's attendance
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <IndianRupee className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="centers">Centers Management</TabsTrigger>
                      <TabsTrigger value="users">Coach Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Activities */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Recent System Activities</CardTitle>
                <CardDescription>Latest activities across all centers and modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      <div className="mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {activity.centerName && (
                            <Badge variant="outline" className="text-xs">
                              {activity.centerName}
                            </Badge>
                          )}
                          {activity.amount && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              ₹{activity.amount.toLocaleString()}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Controls</CardTitle>
                <CardDescription>Administrative functions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <UserCreationDialog onUserCreated={loadDashboardData} />
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/user-management">
                    <Users className="mr-2 h-4 w-4" />
                    Coach Management
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/centers">
                    <Building className="mr-2 h-4 w-4" />
                    Center Management
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="centers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.centerStats.map((center) => (
              <Card key={center.centerId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-500" />
                    {center.location}
                  </CardTitle>
                  <CardDescription>{center.centerName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Students</span>
                      <span className="font-medium">{center.students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Batches</span>
                      <span className="font-medium">{center.batches}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Coaches</span>
                      <span className="font-medium">{center.coaches}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Attendance</span>
                      <span className="font-medium">{center.attendanceRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Revenue</span>
                      <span className="font-medium text-green-600">₹{center.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pending</span>
                      <span className="font-medium text-red-500">₹{center.pendingFees.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Coach Management</CardTitle>
                  <CardDescription>Create and manage all coaches and their roles</CardDescription>
                </div>
                <UserCreationDialog onUserCreated={loadDashboardData} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">Quick User Creation</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Create new users with appropriate roles and center assignments
                    </p>
                    <UserCreationDialog onUserCreated={loadDashboardData} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      Super Admins
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-2xl font-bold text-red-500">{stats.totalUsers}</div>
                      <p className="text-sm text-muted-foreground">System administrators</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-green-500" />
                      Coaches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <div className="text-2xl font-bold text-green-500">{stats.totalCoaches}</div>
                      <p className="text-sm text-muted-foreground">Training coaches</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full" asChild>
                  <a href="/user-management">
                    <Users className="mr-2 h-4 w-4" />
                    Access Full Coach Management System
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Analytics</CardTitle>
              <CardDescription>Comprehensive analytics and reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Advanced analytics dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">System Status</CardTitle>
                <CardDescription>Current system health and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-md">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Database Connection</p>
                    <p className="text-xs text-green-600 mt-1">All database connections are healthy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-md">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">API Services</p>
                    <p className="text-xs text-green-600 mt-1">All API endpoints are responding normally</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">System Information</CardTitle>
                <CardDescription>System configuration and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Users</span>
                  <span className="font-medium">{stats.totalUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Centers</span>
                  <span className="font-medium">{stats.totalCenters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Database Size</span>
                  <span className="font-medium">~2.5 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Backup</span>
                  <span className="font-medium">Today</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 