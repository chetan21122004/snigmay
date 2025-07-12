"use client"

import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  CheckCircle2
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

// Sample data for charts
const attendanceData = [85, 78, 92, 88, 76, 82, 90];
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly')

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

  // Function to get a color based on value
  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600"
    if (rate >= 75) return "text-amber-500"
    return "text-red-500"
  }

  const getFeeStatusColor = (pendingAmount: number, totalAmount: number) => {
    const ratio = pendingAmount / totalAmount
    if (ratio <= 0.1) return "text-green-600"
    if (ratio <= 0.25) return "text-amber-500"
    return "text-red-500"
  }

  // Calculate stats for display
  const collectionRate = stats.totalRevenue > 0 
    ? ((stats.totalRevenue / (stats.totalRevenue + stats.pendingFees)) * 100).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header with title and time selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          {/* <h1 className="text-3xl font-bold text-gray-900">{getDashboardTitle()}</h1> */}
          <p className="text-gray-600 mt-1">Football Academy Management Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <Select value={timeframe} onValueChange={(value: 'weekly' | 'monthly') => setTimeframe(value)}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                <ArrowUpRight className="mr-1 h-3 w-3" /> 
                +5 this month
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Active enrolled students across all batches
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
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  <User className="mr-1 h-3 w-3" />
                  {Math.round(stats.totalStudents / (stats.totalBatches || 1))} avg. size
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Active training groups across centers
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
              {stats.attendanceToday} present out of {Math.round(stats.attendanceToday / (stats.attendanceRate / 100))} students
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

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="fees">Fee Management</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Attendance Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Attendance Trends</CardTitle>
                <CardDescription>Attendance percentage by day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-end justify-between gap-2">
                  {attendanceData.map((value, index) => (
                    <div key={index} className="relative flex flex-col items-center">
                      <div 
                        className={`w-12 rounded-t-md ${value > 85 ? 'bg-green-500' : value > 75 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ height: `${value * 1.5}px` }}
                      ></div>
                      <div className="absolute bottom-0 w-full h-full flex flex-col justify-between items-center">
                        <span className="text-xs font-medium text-white mt-1">{value}%</span>
                        <span className="text-xs text-muted-foreground mt-2">{daysOfWeek[index]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                Average weekly attendance: {attendanceData.reduce((a, b) => a + b, 0) / attendanceData.length}%
              </CardFooter>
            </Card>

            {/* Alerts and Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alerts & Notifications</CardTitle>
                <CardDescription>Important updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-md">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Fee Payment Overdue</p>
                    <p className="text-xs text-red-600 mt-1">8 students have fees overdue by more than 15 days</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-md">
                  <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Attendance Alert</p>
                    <p className="text-xs text-amber-600 mt-1">5 students have missed more than 3 consecutive sessions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-md">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Tournament Registration</p>
                    <p className="text-xs text-green-600 mt-1">Registration for Summer Cup opens next week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest updates across centers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Timeline style activity feed */}
                  <div className="relative pl-6 border-l border-gray-200">
                    <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-blue-500 -translate-x-1/2"></div>
                    <div>
                      <p className="text-sm">New student registration</p>
                      <p className="text-xs text-muted-foreground">Rahul Sharma joined U-12 batch</p>
                      <p className="text-xs text-muted-foreground mt-1">Today, 10:45 AM</p>
                    </div>
                  </div>
                  
                  <div className="relative pl-6 border-l border-gray-200">
                    <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-green-500 -translate-x-1/2"></div>
                    <div>
                      <p className="text-sm">Fee payment received</p>
                      <p className="text-xs text-muted-foreground">₹5,000 received from Priya Patel</p>
                      <p className="text-xs text-muted-foreground mt-1">Today, 9:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="relative pl-6 border-l border-gray-200">
                    <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-purple-500 -translate-x-1/2"></div>
                    <div>
                      <p className="text-sm">Attendance marked</p>
                      <p className="text-xs text-muted-foreground">Coach Rajesh marked attendance for U-14 batch</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday, 5:15 PM</p>
                    </div>
                  </div>
                  
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-amber-500 -translate-x-1/2"></div>
                    <div>
                      <p className="text-sm">New batch created</p>
                      <p className="text-xs text-muted-foreground">U-10 Evening batch created at Viman Nagar center</p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday, 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Summary</CardTitle>
                <CardDescription>Fee collection and pending dues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Revenue</span>
                    <span className="font-semibold">₹{stats.totalRevenue.toLocaleString()}</span>
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
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-3">Fee Collection by Center</p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Kharadi</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} className="h-1.5" />
                      </div>
                      {/* <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Viman Nagar</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Hadapsar</span>
                          <span>68%</span>
                        </div>
                        <Progress value={68} className="h-1.5" />
                      </div> */}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Detailed Report
                </Button>
              </CardFooter>
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