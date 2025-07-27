"use client"

import React, { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"
import { useCenterContext } from "@/context/center-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, Users, GraduationCap, CreditCard, BarChart3, Clock, MapPin, UserCheck, Target, Trophy, ArrowUpRight, TrendingUp, AlertCircle, CheckCircle, Activity, IndianRupee, UserPlus, ClipboardList, Plus, Eye, Zap, CheckCircle2 } from "lucide-react"
import Image from "next/image"

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
  centerName?: string // Added for enhanced activity display
}

export default function MainDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { 
    selectedCenter, 
    getStudentsByCenter, 
    getBatchesByCenter, 
    getAttendanceByCenter, 
    getFeesByCenter 
  } = useCenterContext()

  useEffect(() => {
  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
        console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }
    loadUser()
  }, [])

  // Calculate center-specific stats
  const getCenterStats = (): DashboardStats => {
    if (!selectedCenter) {
      return {
        totalStudents: 0,
        totalBatches: 0,
        totalCenters: 1,
        attendanceToday: 0,
        attendanceRate: 0,
        pendingFees: 0,
        totalRevenue: 0
      }
    }

    const centerStudents = getStudentsByCenter(selectedCenter.id)
    const centerBatches = getBatchesByCenter(selectedCenter.id)
    const centerAttendance = getAttendanceByCenter(selectedCenter.id)
    const centerFees = getFeesByCenter(selectedCenter.id)

    // Calculate today's attendance
    const today = new Date().toISOString().split('T')[0]
    const todayAttendance = centerAttendance.filter(record => record.date === today)
    const presentToday = todayAttendance.filter(record => record.status === 'present').length
    const attendanceRate = centerStudents.length > 0 ? (presentToday / centerStudents.length) * 100 : 0

    // Calculate fees
    const pendingFees = centerFees.filter(fee => fee.status === 'due' || fee.status === 'overdue').length
    const totalRevenue = centerFees
      .filter(fee => fee.status === 'paid')
      .reduce((sum, fee) => sum + Number(fee.amount), 0)

    return {
      totalStudents: centerStudents.length,
      totalBatches: centerBatches.length,
      totalCenters: 1,
      attendanceToday: presentToday,
      attendanceRate: Math.round(attendanceRate),
      pendingFees,
      totalRevenue
    }
  }

  // Get center-specific recent activities
  const getRecentActivities = (): RecentActivity[] => {
    if (!selectedCenter) return []

    const activities: RecentActivity[] = []
    const centerFees = getFeesByCenter(selectedCenter.id)
    const centerAttendance = getAttendanceByCenter(selectedCenter.id)
    const centerStudents = getStudentsByCenter(selectedCenter.id)

    // Add recent fee payments
    centerFees
      .filter(fee => fee.status === 'paid')
      .slice(0, 3)
      .forEach(fee => {
        const student = centerStudents.find(s => s.id === fee.student_id)
        activities.push({
          id: fee.id,
          type: 'payment',
          description: `Fee payment received from ${student?.full_name || 'Student'} - ₹${fee.amount}`,
          timestamp: fee.payment_date,
          amount: Number(fee.amount),
          centerName: selectedCenter.name // Add center name for enhanced display
        })
      })

    // Add recent attendance
    centerAttendance
      .slice(0, 3)
      .forEach(record => {
        const student = centerStudents.find(s => s.id === record.student_id)
        activities.push({
          id: record.id,
          type: 'attendance',
          description: `${student?.full_name || 'Student'} marked ${record.status}`,
          timestamp: record.created_at,
          centerName: selectedCenter.name // Add center name for enhanced display
        })
      })

    // Sort by timestamp and take latest 5
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
  }

  const stats = getCenterStats()
  const recentActivities = getRecentActivities()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <IndianRupee className="h-4 w-4 text-green-500" />
      case 'attendance':
        return <UserCheck className="h-4 w-4 text-blue-500" />
      case 'registration':
        return <UserPlus className="h-4 w-4 text-purple-500" />
      case 'batch_creation':
        return <ClipboardList className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  return (
    <div className="space-y-8">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 rounded-2xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-burgundy-600/90 to-burgundy-800/90"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-300/10 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <Users className="h-8 w-8 text-gold-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}, {user?.full_name || 'User'}!</h1>
                <p className="text-burgundy-100 text-lg">
                  {selectedCenter ? `Managing ${selectedCenter.name}` : 'Welcome to your dashboard'}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right space-y-2">
            <div className="flex items-center gap-2 justify-end">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">System Status</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-300" />
              <span className="text-xl font-bold">All Systems Online</span>
            </div>
            <p className="text-burgundy-100 text-sm">Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Students</CardTitle>
            <div className="p-2 bg-burgundy-50 rounded-lg group-hover:bg-burgundy-100 transition-colors">
              <Users className="h-5 w-5 text-burgundy-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-burgundy-700 mb-2">{stats.totalStudents}</div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-burgundy-500 h-2 rounded-full" style={{ width: `${Math.min((stats.totalStudents / 500) * 100, 100)}%` }}></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Active enrollments</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">Active Batches</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <ClipboardList className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 mb-2">{stats.totalBatches}</div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((stats.totalBatches / 50) * 100, 100)}%` }}></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Training groups</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">Today's Attendance</CardTitle>
            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 mb-2">{stats.attendanceRate}%</div>
            <div className="mt-2">
              <Progress value={stats.attendanceRate} className="h-2 bg-gray-200" />
            </div>
            <p className="text-xs text-gray-500 mt-2">{stats.attendanceToday} present today</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">Pending Fees</CardTitle>
            <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
              <CreditCard className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700 mb-2">{stats.pendingFees}</div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min((stats.pendingFees / 100) * 100, 100)}%` }}></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Outstanding payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/30">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-burgundy-50 rounded-lg">
                <Activity className="h-5 w-5 text-burgundy-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Recent Activities</CardTitle>
                <CardDescription>Latest activities and updates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-all duration-200 group">
                  <div className="mt-1 p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {activity.centerName && (
                        <Badge variant="outline" className="text-xs bg-burgundy-50 text-burgundy-700 border-burgundy-200">
                          {activity.centerName}
                        </Badge>
                      )}
                      {activity.amount && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          ₹{activity.amount.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/30">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-burgundy-50 rounded-lg">
                <Zap className="h-5 w-5 text-burgundy-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Button variant="outline" className="w-full justify-start h-12 text-left group hover:bg-burgundy-50 hover:border-burgundy-200" asChild>
              <a href="/attendance">
                <UserCheck className="mr-3 h-5 w-5 text-burgundy-600 group-hover:text-burgundy-700" />
                <div>
                  <div className="font-semibold">Mark Attendance</div>
                  <div className="text-xs text-gray-500">Record student attendance</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 text-left group hover:bg-burgundy-50 hover:border-burgundy-200" asChild>
              <a href="/students">
                <Users className="mr-3 h-5 w-5 text-burgundy-600 group-hover:text-burgundy-700" />
                <div>
                  <div className="font-semibold">Manage Students</div>
                  <div className="text-xs text-gray-500">Add or edit students</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 text-left group hover:bg-burgundy-50 hover:border-burgundy-200" asChild>
              <a href="/fees">
                <CreditCard className="mr-3 h-5 w-5 text-burgundy-600 group-hover:text-burgundy-700" />
                <div>
                  <div className="font-semibold">Fee Management</div>
                  <div className="text-xs text-gray-500">Handle payments</div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start h-12 text-left group hover:bg-burgundy-50 hover:border-burgundy-200" asChild>
              <a href="/batches">
                <ClipboardList className="mr-3 h-5 w-5 text-burgundy-600 group-hover:text-burgundy-700" />
                <div>
                  <div className="font-semibold">Batch Management</div>
                  <div className="text-xs text-gray-500">Manage training batches</div>
                </div>
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 