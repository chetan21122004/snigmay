"use client"

import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Calendar, 
  CreditCard, 
  Building, 
  GraduationCap,
  ClipboardList,
  UserCheck,
  Clock,
  CalendarDays,
  ArrowRight,
  Plus,
  Eye,
  IndianRupee
} from "lucide-react"

interface User {
  id: string
  email: string
  full_name: string
  role: string
  center_id: string | null
}

interface DashboardStats {
  totalStudents: number
  totalBatches: number
  totalCenters: number
  attendanceToday: number
  attendanceRate: number
  pendingFees: number
  totalRevenue: number
}

interface RecentActivity {
  id: string
  type: 'payment' | 'attendance' | 'registration' | 'batch_creation'
  description: string
  timestamp: string
  amount?: number
}

export function MainDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalBatches: 0,
    totalCenters: 0,
    attendanceToday: 0,
    attendanceRate: 0,
    pendingFees: 0,
    totalRevenue: 0
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
    loadDashboardData()
    loadRecentActivities()
  }, [])

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error("Error loading user:", error)
    }
  }

  const loadDashboardData = async () => {
    try {
      const [statsRes, centersRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/centers')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (centersRes.ok) {
        const centersData = await centersRes.json()
        setStats(prev => ({ ...prev, totalCenters: centersData.length }))
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecentActivities = async () => {
    try {
      const response = await fetch('/api/dashboard/recent-activities')
      if (response.ok) {
        const data = await response.json()
        setRecentActivities(data.slice(0, 5)) // Show only 5 recent activities
      }
    } catch (error) {
      console.error("Error loading recent activities:", error)
    }
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    const firstName = user?.full_name?.split(' ')[0] || 'User'
    
    if (hour < 12) return `Good Morning, ${firstName}!`
    if (hour < 17) return `Good Afternoon, ${firstName}!`
    return `Good Evening, ${firstName}!`
  }

  const getRoleDescription = () => {
    if (!user?.role) return "Welcome to your dashboard"
    
    const descriptions: Record<string, string> = {
      super_admin: "Manage all centers and operations",
      club_manager: "Oversee club operations and management",
      head_coach: "Lead coaching staff and training programs",
      coach: "Manage your batches and students",
      center_manager: "Manage your center operations"
    }
    
    return descriptions[user.role] || "Welcome to your dashboard"
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="h-4 w-4 text-green-500" />
      case 'attendance':
        return <UserCheck className="h-4 w-4 text-blue-500" />
      case 'registration':
        return <Users className="h-4 w-4 text-purple-500" />
      case 'batch_creation':
        return <ClipboardList className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{getWelcomeMessage()}</h1>
            <p className="text-blue-100 mt-1">{getRoleDescription()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Today's Date</p>
            <p className="text-lg font-semibold">{new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Enrolled across all centers
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Batches</CardTitle>
            <ClipboardList className="h-5 w-5 text-green-500" />
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
            <CardTitle className="text-sm font-medium">Centers</CardTitle>
            <Building className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCenters}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Training locations
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <UserCheck className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.attendanceToday} students present
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Activities</span>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </CardTitle>
            <CardDescription>Latest updates and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {activity.amount && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            ₹{activity.amount.toLocaleString()}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <p>No recent activities</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/students">
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/batches">
                <Plus className="mr-2 h-4 w-4" />
                Create Batch
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/attendance">
                <UserCheck className="mr-2 h-4 w-4" />
                Mark Attendance
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/fees">
                <CreditCard className="mr-2 h-4 w-4" />
                Collect Fees
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-green-500" />
              Fee Collection
            </CardTitle>
            <CardDescription>Revenue overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Revenue</span>
                <span className="font-semibold text-green-600">₹{stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Fees</span>
                <span className="font-semibold text-red-500">₹{stats.pendingFees.toLocaleString()}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <a href="/fees">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Manage Fees
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-500" />
              Attendance Overview
            </CardTitle>
            <CardDescription>Student attendance summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Present Today</span>
                <span className="font-semibold text-green-600">{stats.attendanceToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Attendance Rate</span>
                <span className="font-semibold">{stats.attendanceRate}%</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <a href="/attendance">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  View Attendance
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 