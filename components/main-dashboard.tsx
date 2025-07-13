"use client"

import { useState, useEffect } from "react"
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  UserCheck,
  UserX,
  Clock,
  Target,
  Trophy,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  User,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Users2,
  IndianRupee
} from "lucide-react"

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
  centerStats?: CenterStats[]
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
  centerName?: string
}

export function MainDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [centers, setCenters] = useState<Center[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalBatches: 0,
    totalCoaches: 0,
    attendanceToday: 0,
    attendanceRate: 0,
    pendingFees: 0,
    totalRevenue: 0,
    recentPayments: 0,
    centerStats: []
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      // Load centers
      const centersResponse = await fetch('/api/centers')
      const centersData = await centersResponse.json()
      setCenters(centersData)

      // Load dashboard stats based on user role
      const selectedCenter = localStorage.getItem("selectedCenter") || "all"
      const statsResponse = await fetch(`/api/dashboard/stats?center=${selectedCenter}`)
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Load recent activities
      await loadRecentActivities()

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecentActivities = async () => {
    try {
      const response = await fetch('/api/dashboard/recent-activities')
      if (response.ok) {
        const activities = await response.json()
        setRecentActivities(activities)
      }
    } catch (error) {
      console.error('Error loading recent activities:', error)
      // Fallback to mock data
      setRecentActivities([
        {
          id: '1',
          type: 'payment',
          description: 'Fee payment received from Arjun Sharma',
          timestamp: new Date().toISOString(),
          amount: 3500,
          centerName: 'Kharadi'
        },
        {
          id: '2',
          type: 'attendance',
          description: 'Attendance marked for U-14 batch',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          centerName: 'Viman Nagar'
        },
        {
          id: '3',
          type: 'registration',
          description: 'New student registration - Priya Patel',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          centerName: 'Hadapsar'
        }
      ])
    }
  }

  const getDashboardTitle = () => {
    if (!user) return 'Dashboard'
    
    const selectedCenter = localStorage.getItem("selectedCenter") || "all"
    
    if (selectedCenter === 'all') {
      return 'Snigmay Pune FC - Overview'
    }
    
    const center = centers.find(c => c.id === selectedCenter)
    return center ? `${center.location} Center` : 'Dashboard'
  }

  const getWelcomeMessage = () => {
    if (!user) return 'Welcome to Snigmay Pune FC'
    
    const roleMap: Record<string, string> = {
      super_admin: 'Super Administrator',
      club_manager: 'Club Manager',
      head_coach: 'Head Coach',
      coach: 'Coach',
      center_manager: 'Center Manager'
    }
    
    return `Welcome back, ${user.full_name}`
  }

  const getRoleDescription = () => {
    if (!user) return ''
    
    const roleDescriptions: Record<string, string> = {
      super_admin: 'You have full access to all centers and administrative functions.',
      club_manager: 'You can manage operations across all centers.',
      head_coach: 'You can oversee coaching and training across all centers.',
      coach: 'You can manage your assigned batches and students.',
      center_manager: 'You can manage operations for your assigned center.'
    }
    
    return roleDescriptions[user.role] || ''
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
        return <Clock className="h-4 w-4 text-gray-500" />
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

  // Calculate stats for display
  const collectionRate = stats.totalRevenue > 0 
    ? ((stats.totalRevenue / (stats.totalRevenue + stats.pendingFees)) * 100).toFixed(1)
    : "0.0"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
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
                <ArrowUpRight className="mr-1 h-3 w-3" /> 
                Active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Enrolled across all centers
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
              {stats.attendanceToday} students present today
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Collection</CardTitle>
            <IndianRupee className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <div className="mt-2">
              <Progress value={parseFloat(collectionRate)} className="h-2" />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-muted-foreground">{collectionRate}% collected</span>
              <span className="text-red-500">₹{stats.pendingFees.toLocaleString()} pending</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="centers">Centers</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
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
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" className="w-full">
                  <Clock className="mr-2 h-4 w-4" />
                  View All Activities
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
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
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/students">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Students
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/batches">
                    <Layers className="mr-2 h-4 w-4" />
                    Manage Batches
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Summary</CardTitle>
                <CardDescription>Revenue and collection overview</CardDescription>
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
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attendance Overview</CardTitle>
                <CardDescription>Student attendance metrics</CardDescription>
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
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="centers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center) => (
              <Card key={center.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-500" />
                    {center.location}
                  </CardTitle>
                  <CardDescription>{center.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Students</span>
                      <span className="font-medium">
                        {stats.centerStats?.find(s => s.centerId === center.id)?.students || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Batches</span>
                      <span className="font-medium">
                        {stats.centerStats?.find(s => s.centerId === center.id)?.batches || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Coaches</span>
                      <span className="font-medium">
                        {stats.centerStats?.find(s => s.centerId === center.id)?.coaches || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators across centers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Performance analytics coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Critical Alerts</CardTitle>
                <CardDescription>Issues requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-md">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Overdue Fees</p>
                    <p className="text-xs text-red-600 mt-1">
                      8 students have fees overdue by more than 15 days
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-md">
                  <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Low Attendance</p>
                    <p className="text-xs text-amber-600 mt-1">
                      5 students have missed more than 3 consecutive sessions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">System Status</CardTitle>
                <CardDescription>Current system health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-md">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">All Systems Operational</p>
                    <p className="text-xs text-green-600 mt-1">
                      Database and services are running smoothly
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <Trophy className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Upcoming Events</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Summer tournament registration opens next week
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 