"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useCenterContext } from "@/context/center-context"
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
  Activity,
  TrendingUp,
  Briefcase
} from "lucide-react"

interface DashboardStats {
  totalStudents: number
  totalBatches: number
  totalCoaches: number
  totalCenters: number
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
  type: 'payment' | 'attendance' | 'registration' | 'batch_creation'
  description: string
  timestamp: string
  amount?: number
  centerName?: string
}

export function ClubManagerDashboard() {
  const { selectedCenter } = useCenterContext()
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalBatches: 0,
    totalCoaches: 0,
    totalCenters: 0,
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
      // Get overall statistics across all centers
      const [
        { data: students },
        { data: batches },
        { data: coaches },
        { data: centers },
        { data: attendanceToday },
        { data: feePayments }
      ] = await Promise.all([
        supabase.from('students').select('id'),
        supabase.from('batches').select('id'),
        supabase.from('users').select('id').eq('role', 'coach'),
        supabase.from('centers').select('id'),
        supabase.from('attendance').select('status').eq('date', new Date().toISOString().split('T')[0]),
        supabase.from('fee_payments').select('amount, status, payment_date')
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
      
      const [
        { data: payments },
        { data: students },
        { data: batches },
        { data: attendance }
      ] = await Promise.all([
        supabase.from('fee_payments').select('id, amount, created_at, students(name, centers(location))').eq('status', 'paid').gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10),
        supabase.from('students').select('id, name, created_at, centers(location)').gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10),
        supabase.from('batches').select('id, name, created_at, centers(location)').gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10),
        supabase.from('attendance').select('id, created_at, students(name, centers(location))').gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10)
      ])

      const activities: RecentActivity[] = []

      // Process payments
      payments?.forEach((payment: any) => {
        activities.push({
          id: payment.id,
          type: 'payment',
          description: `Fee payment received - ₹${payment.amount} from ${payment.students?.name}`,
          timestamp: payment.created_at,
          centerName: payment.students?.centers?.location || 'Unknown Center'
        })
      })

      // Process students
      students?.forEach((student: any) => {
        activities.push({
          id: student.id,
          type: 'registration',
          description: `New student registration - ${student.name}`,
          timestamp: student.created_at,
          centerName: student.centers?.location || 'Unknown Center'
        })
      })

      // Process batches
      batches?.forEach((batch: any) => {
        activities.push({
          id: batch.id,
          type: 'batch_creation',
          description: `New batch created - ${batch.name}`,
          timestamp: batch.created_at,
          centerName: batch.centers?.location || 'Unknown Center'
        })
      })

      // Process attendance
      attendance?.forEach((record: any) => {
        activities.push({
          id: record.id,
          type: 'attendance',
          description: `Attendance marked for ${record.students?.name}`,
          timestamp: record.created_at,
          centerName: record.students?.centers?.location || 'Unknown Center'
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

  const collectionRate = stats.totalRevenue > 0 
    ? ((stats.totalRevenue / (stats.totalRevenue + stats.pendingFees)) * 100).toFixed(1)
    : "0.0"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading Club Manager Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Club Manager Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="h-6 w-6" />
              Club Manager Dashboard
            </h1>
            <p className="text-blue-100 mt-1">Manage attendance and financials across all centers - Strategic oversight</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Collection Rate</p>
            <p className="text-lg font-semibold">{collectionRate}%</p>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                <Building className="mr-1 h-3 w-3" />
                {stats.totalCenters} Centers
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Across all training centers
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Batches</CardTitle>
            <Layers className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBatches}</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <Users2 className="mr-1 h-3 w-3" />
                {Math.round(stats.totalStudents / (stats.totalBatches || 1))} avg. size
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Active training groups
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
              {stats.attendanceToday} students present
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <div className="mt-2">
              <Progress value={parseFloat(collectionRate)} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ₹{stats.pendingFees.toLocaleString()} pending
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="centers">Centers</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activities</CardTitle>
                <CardDescription>Latest updates across all centers</CardDescription>
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

            {/* Management Actions */}
          <Card>
            <CardHeader>
                <CardTitle className="text-lg">Management Actions</CardTitle>
                <CardDescription>Key management functions</CardDescription>
            </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/attendance">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Attendance Management
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/fees">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Fee Management
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/students">
                    <Users className="mr-2 h-4 w-4" />
                    Student Management
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/batches">
                    <Layers className="mr-2 h-4 w-4" />
                    Batch Management
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
        
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Overview</CardTitle>
                <CardDescription>Revenue and collection summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Revenue</span>
                    <span className="font-semibold text-green-600">₹{stats.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Fees</span>
                    <span className="font-semibold text-red-500">₹{stats.pendingFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Collection Rate</span>
                    <span className={`font-semibold ${parseFloat(collectionRate) > 85 ? 'text-green-500' : parseFloat(collectionRate) > 70 ? 'text-amber-500' : 'text-red-500'}`}>
                      {collectionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Recent Payments</span>
                    <span className="font-semibold text-blue-600">₹{stats.recentPayments.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <a href="/fees">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Fees
                  </a>
                </Button>
              </CardFooter>
            </Card>

          <Card>
            <CardHeader>
                <CardTitle className="text-lg">Center-wise Revenue</CardTitle>
                <CardDescription>Revenue breakdown by center</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                  {stats.centerStats.map((center) => (
                    <div key={center.centerId}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{center.location}</span>
                        <span>₹{center.revenue.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={stats.totalRevenue > 0 ? (center.revenue / stats.totalRevenue) * 100 : 0} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
                <CardTitle className="text-lg">Attendance Overview</CardTitle>
                <CardDescription>Student attendance across centers</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Today's Attendance</span>
                    <span className="font-semibold">{stats.attendanceToday} / {stats.totalStudents}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Attendance Rate</span>
                      <span>{stats.attendanceRate}%</span>
                    </div>
                    <Progress value={stats.attendanceRate} className="h-2" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Absent Today</span>
                    <span className="font-semibold text-red-500">{stats.totalStudents - stats.attendanceToday}</span>
                  </div>
                </div>
            </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <a href="/attendance">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Manage Attendance
                  </a>
                </Button>
              </CardFooter>
          </Card>
        
          <Card>
            <CardHeader>
                <CardTitle className="text-lg">Center-wise Attendance</CardTitle>
                <CardDescription>Attendance rates by center</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                  {stats.centerStats.map((center) => (
                    <div key={center.centerId}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{center.location}</span>
                        <span>{center.attendanceRate}%</span>
                      </div>
                      <Progress value={center.attendanceRate} className="h-2" />
                    </div>
                  ))}
                </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 