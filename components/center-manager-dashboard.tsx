"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useCenterContext } from "@/context/center-context"
import { getCurrentUser } from "@/lib/auth"
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
  MapPin,
  Settings
} from "lucide-react"

interface DashboardStats {
  totalStudents: number
  totalBatches: number
  totalCoaches: number
  attendanceToday: number
  attendanceRate: number
  pendingFees: number
  totalRevenue: number
  recentPayments: number
  batchDetails: BatchDetail[]
}

interface BatchDetail {
  id: string
  name: string
  students: number
  attendanceRate: number
  feeCollectionRate: number
  coachName: string
  ageGroup: string
}

interface User {
  id: string
  email: string
  full_name: string
  role: string
  center_id: string | null
}

interface RecentActivity {
  id: string
  type: 'payment' | 'attendance' | 'registration' | 'batch_creation'
  description: string
  timestamp: string
  amount?: number
  batchName?: string
}

export function CenterManagerDashboard() {
  const { selectedCenter } = useCenterContext()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalBatches: 0,
    totalCoaches: 0,
    attendanceToday: 0,
    attendanceRate: 0,
    pendingFees: 0,
    totalRevenue: 0,
    recentPayments: 0,
    batchDetails: []
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [centerName, setCenterName] = useState<string>("")

  useEffect(() => {
    loadDashboardData()
  }, [selectedCenter])

  const loadDashboardData = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      
      if (currentUser && currentUser.center_id) {
        await Promise.all([
          loadCenterStats(currentUser.center_id),
          loadCenterName(currentUser.center_id),
          loadRecentActivities(currentUser.center_id)
        ])
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCenterName = async (centerId: string) => {
    try {
      const { data: center } = await supabase
        .from('centers')
        .select('name, location')
        .eq('id', centerId)
      
      if (center && center.length > 0) {
        setCenterName(center[0].location)
      }
    } catch (error) {
      console.error('Error loading center name:', error)
    }
  }
  
  const loadCenterStats = async (centerId: string) => {
    try {
      // Get batches for this center
      const { data: batches } = await supabase
        .from('batches')
        .select('id, name, coach_id, users(full_name)')
        .eq('center_id', centerId)

      // Get coaches for this center
      const { data: coaches } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'coach')
        .eq('center_id', centerId)

      // Get students for this center
      const { data: students } = await supabase
        .from('students')
        .select('id, batch_id')
        .in('batch_id', batches?.map(b => b.id) || [])

      // Get today's attendance
      const { data: attendanceToday } = await supabase
        .from('attendance')
        .select('status')
        .in('batch_id', batches?.map(b => b.id) || [])
        .eq('date', new Date().toISOString().split('T')[0])

      // Get fee payments
      const { data: feePayments } = await supabase
        .from('fee_payments')
        .select('amount, status, payment_date')
        .in('student_id', students?.map(s => s.id) || [])

      // Calculate basic stats
      const totalStudents = students?.length || 0
      const totalBatches = batches?.length || 0
      const totalCoaches = coaches?.length || 0
      const presentToday = attendanceToday?.filter(a => a.status === 'present').length || 0
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

      // Get batch details
      const batchDetails = await Promise.all(
        (batches || []).map(async (batch) => {
          const { data: batchStudents } = await supabase
            .from('students')
            .select('id')
            .eq('batch_id', batch.id)

          const { data: batchAttendance } = await supabase
            .from('attendance')
            .select('status')
            .eq('batch_id', batch.id)
            .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])

          const { data: batchFees } = await supabase
            .from('fee_payments')
            .select('status')
            .in('student_id', batchStudents?.map(s => s.id) || [])

          const batchStudentCount = batchStudents?.length || 0
          const batchPresentCount = batchAttendance?.filter(a => a.status === 'present').length || 0
          const batchAttendanceRate = batchAttendance && batchAttendance.length > 0 ? Math.round((batchPresentCount / batchAttendance.length) * 100) : 0

          const batchPaidFees = batchFees?.filter(f => f.status === 'paid').length || 0
          const batchTotalFees = batchFees?.length || 0
          const batchFeeCollectionRate = batchTotalFees > 0 ? Math.round((batchPaidFees / batchTotalFees) * 100) : 0

          const ageGroup = batch.name.match(/U-(\d+)/)?.[0] || 'Unknown'

          return {
            id: batch.id,
            name: batch.name,
            students: batchStudentCount,
            attendanceRate: batchAttendanceRate,
            feeCollectionRate: batchFeeCollectionRate,
            coachName: (batch.users as any)?.full_name || 'Unassigned',
            ageGroup
          }
        })
      )

      setStats({
        totalStudents,
        totalBatches,
        totalCoaches,
        attendanceToday: presentToday,
        attendanceRate,
        pendingFees: totalPendingFees,
        totalRevenue,
        recentPayments,
        batchDetails
      })
    } catch (error) {
      console.error('Error loading center stats:', error)
    }
  }

  const loadRecentActivities = async (centerId: string) => {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      
      // Get batches for this center
      const { data: batches } = await supabase
        .from('batches')
        .select('id, name')
        .eq('center_id', centerId)

      if (!batches || batches.length === 0) return

      const batchIds = batches.map(b => b.id)

      const [
        { data: payments },
        { data: attendance },
        { data: students }
      ] = await Promise.all([
        supabase.from('fee_payments').select('id, amount, created_at, students(name, batch_id)').eq('status', 'paid').in('students.batch_id', batchIds).gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10),
        supabase.from('attendance').select('id, created_at, batch_id').in('batch_id', batchIds).gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10),
        supabase.from('students').select('id, name, created_at, batch_id').in('batch_id', batchIds).gte('created_at', sevenDaysAgo).order('created_at', { ascending: false }).limit(10)
      ])

      const activities: RecentActivity[] = []

      // Process payments
      payments?.forEach((payment: any) => {
        const batch = batches.find(b => b.id === payment.students?.batch_id)
        activities.push({
          id: `payment-${payment.id}`,
          type: 'payment',
          description: `Fee payment from ${payment.students?.name || 'Unknown Student'}`,
          timestamp: payment.created_at,
          amount: Number(payment.amount),
          batchName: batch?.name || 'Unknown Batch'
        })
      })

      // Process attendance
      attendance?.forEach(record => {
        const batch = batches.find(b => b.id === record.batch_id)
        activities.push({
          id: `attendance-${record.id}`,
          type: 'attendance',
          description: `Attendance marked for ${batch?.name || 'Unknown Batch'}`,
          timestamp: record.created_at,
          batchName: batch?.name || 'Unknown Batch'
        })
      })

      // Process student registrations
      students?.forEach(student => {
        const batch = batches.find(b => b.id === student.batch_id)
        activities.push({
          id: `registration-${student.id}`,
          type: 'registration',
          description: `New student registered - ${student.name}`,
          timestamp: student.created_at,
          batchName: batch?.name || 'Unknown Batch'
        })
      })

      // Sort by timestamp and limit
      const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 15)

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

  const getPerformanceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600"
    if (rate >= 75) return "text-amber-500"
    return "text-red-500"
  }

  const collectionRate = stats.totalRevenue > 0 
    ? ((stats.totalRevenue / (stats.totalRevenue + stats.pendingFees)) * 100).toFixed(1)
    : "0.0"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading Center Manager Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Center Manager Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
              <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              Center Manager Dashboard
            </h1>
            <p className="text-purple-100 mt-1">Operational coordination for {centerName} Center</p>
                </div>
          <div className="text-right">
            <p className="text-sm text-purple-100">Center Performance</p>
            <div className="flex items-center gap-2 mt-1">
              <Target className="h-4 w-4 text-yellow-300" />
              <span className="text-lg font-semibold">{collectionRate}% Collection Rate</span>
            </div>
          </div>
        </div>
            </div>

      {/* Center Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Center Students</CardTitle>
            <GraduationCap className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                <Building className="mr-1 h-3 w-3" />
                {centerName}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Enrolled at this center
            </p>
          </CardContent>
        </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Batches</CardTitle>
            <Layers className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{stats.totalBatches}</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                <Users2 className="mr-1 h-3 w-3" />
                {stats.totalCoaches} Coaches
              </Badge>
            </div>
              <p className="text-xs text-muted-foreground mt-2">
              Active training groups
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <UserCheck className="h-5 w-5 text-green-500" />
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
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
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
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <Card className="lg:col-span-2">
          <CardHeader>
                <CardTitle className="text-lg">Recent Center Activities</CardTitle>
                <CardDescription>Latest updates from {centerName} Center</CardDescription>
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
                          {activity.batchName && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {activity.batchName}
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
                <CardTitle className="text-lg">Center Management</CardTitle>
                <CardDescription>Operational tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/attendance">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Track Attendance
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/fees">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Fees
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/students">
                    <Users className="mr-2 h-4 w-4" />
                    Student Records
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/batches">
                    <Layers className="mr-2 h-4 w-4" />
                    Batch Coordination
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
          </TabsContent>

        <TabsContent value="batches" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {stats.batchDetails.map((batch) => (
              <Card key={batch.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Layers className="h-5 w-5 text-blue-500" />
                        {batch.name}
                      </CardTitle>
                      <CardDescription>Coach: {batch.coachName}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {batch.ageGroup}
                    </Badge>
                </div>
              </CardHeader>
              <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{batch.students}</div>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getPerformanceColor(batch.attendanceRate)}`}>
                        {batch.attendanceRate}%
                      </div>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                      <Progress value={batch.attendanceRate} className="h-1 mt-1" />
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getPerformanceColor(batch.feeCollectionRate)}`}>
                        {batch.feeCollectionRate}%
                      </div>
                      <p className="text-xs text-muted-foreground">Fee Collection</p>
                      <Progress value={batch.feeCollectionRate} className="h-1 mt-1" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((batch.attendanceRate + batch.feeCollectionRate) / 2)}%
                      </div>
                      <p className="text-xs text-muted-foreground">Performance</p>
                    </div>
                </div>
              </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Batch
                  </Button>
                </CardFooter>
            </Card>
            ))}
          </div>
          </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Operational Summary</CardTitle>
                <CardDescription>Center operations overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Students</span>
                    <span className="font-semibold">{stats.totalStudents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Batches</span>
                    <span className="font-semibold">{stats.totalBatches}</span>
                          </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Coaches</span>
                    <span className="font-semibold">{stats.totalCoaches}</span>
                        </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Today's Attendance</span>
                    <span className="font-semibold">{stats.attendanceRate}%</span>
                      </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fee Collection Rate</span>
                    <span className={`font-semibold ${parseFloat(collectionRate) > 85 ? 'text-green-500' : parseFloat(collectionRate) > 70 ? 'text-amber-500' : 'text-red-500'}`}>
                      {collectionRate}%
                    </span>
                    </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Overview</CardTitle>
                <CardDescription>Revenue and collections</CardDescription>
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
                    <span className="text-sm">Recent Payments</span>
                    <span className="font-semibold text-blue-600">₹{stats.recentPayments.toLocaleString()}</span>
                      </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Collection Progress</span>
                      <span>{collectionRate}%</span>
                    </div>
                    <Progress value={parseFloat(collectionRate)} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Center Reports</CardTitle>
              <CardDescription>Generate and view reports for {centerName} Center</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Access detailed reports and analytics</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/reports">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Attendance Reports
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/reports">
                      <IndianRupee className="mr-2 h-4 w-4" />
                      Financial Reports
                    </a>
                  </Button>
                </div>
              </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
} 