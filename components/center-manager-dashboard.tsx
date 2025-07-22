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
  Settings,
  UserPlus,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-burgundy-900">{centerName} Center</h1>
          <p className="text-gray-600">Center Management Dashboard</p>
        </div>
        <Image
          src="/snigmay_logo.png"
          alt="Snigmay Pune FC"
          width={100}
          height={100}
          className="h-auto w-auto"
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-burgundy-100 hover:border-burgundy-200 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-burgundy-700">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-burgundy-900">{stats.totalStudents}</div>
            <p className="text-sm text-gray-600 mt-1">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-burgundy-100 hover:border-burgundy-200 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-burgundy-700">
              Active Batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-burgundy-900">{stats.totalBatches}</div>
            <p className="text-sm text-gray-600 mt-1">Training groups</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-burgundy-100 hover:border-burgundy-200 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-burgundy-700">
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.attendanceRate}%</div>
            <p className="text-sm text-gray-600 mt-1">{stats.attendanceToday} students present</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-burgundy-100 hover:border-burgundy-200 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-burgundy-700">
              Fee Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold-600">₹{(stats.totalRevenue / 1000).toFixed(1)}K</div>
            <p className="text-sm text-gray-600 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Batch Performance & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-burgundy-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-burgundy-900">Batch Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.batchDetails.map((batch) => (
                <div key={batch.id}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-burgundy-700">{batch.name}</h3>
                    <span className="text-sm text-gray-600">{batch.students} students</span>
                  </div>
                  <div className="h-2 bg-burgundy-100 rounded-full">
                    <div 
                      className="h-2 bg-burgundy-600 rounded-full" 
                      style={{ width: `${batch.attendanceRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Attendance {batch.attendanceRate}%</span>
                    <span>Fee Collection {batch.feeCollectionRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-burgundy-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-burgundy-900">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center",
                    {
                      'bg-burgundy-100': activity.type === 'registration',
                      'bg-green-100': activity.type === 'attendance',
                      'bg-gold-100': activity.type === 'payment',
                      'bg-blue-100': activity.type === 'batch_creation'
                    }
                  )}>
                    {activity.type === 'registration' && <UserPlus className="h-5 w-5 text-burgundy-600" />}
                    {activity.type === 'attendance' && <Check className="h-5 w-5 text-green-600" />}
                    {activity.type === 'payment' && <CreditCard className="h-5 w-5 text-gold-600" />}
                    {activity.type === 'batch_creation' && <Users className="h-5 w-5 text-blue-600" />}
                  </div>
                  <div>
                    <p className="text-burgundy-900">{activity.description}</p>
                    <p className="text-sm text-gray-600">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 