"use client"

import React, { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"
import { useCenterContext } from "@/context/center-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, Users, GraduationCap, CreditCard, BarChart3, Clock, MapPin, UserCheck, Target, Trophy, ArrowUpRight, TrendingUp, AlertCircle, CheckCircle, Activity, IndianRupee, UserPlus, ClipboardList, Plus, Eye } from "lucide-react"
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
          amount: Number(fee.amount)
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
          timestamp: record.created_at
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.full_name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">
            {selectedCenter ? `Managing ${selectedCenter.name}` : 'Welcome to your dashboard'}
          </p>
          </div>
        <div className="flex items-center gap-3">
          <Button className="bg-burgundy-600 hover:bg-burgundy-700">
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
            <p className="text-xs text-gray-500 mt-1">Active enrollments</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Active Batches</CardTitle>
            <ClipboardList className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalBatches}</div>
            <p className="text-xs text-gray-500 mt-1">Training groups</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Attendance</CardTitle>
              <UserCheck className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.attendanceRate}%</div>
            <p className="text-xs text-gray-500 mt-1">{stats.attendanceToday} present today</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Fees</CardTitle>
              <CreditCard className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.pendingFees}</div>
            <p className="text-xs text-gray-500 mt-1">Outstanding payments</p>
          </CardContent>
        </Card>
      </div>

        {/* Recent Activities */}
      <Card>
          <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates from {selectedCenter?.name || 'your center'}</CardDescription>
            </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
          </div>
          </CardHeader>
          <CardContent>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                  {activity.amount && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      ₹{activity.amount}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activities</p>
              <p className="text-sm text-gray-400 mt-1">Activities will appear here as they happen</p>
            </div>
          )}
          </CardContent>
        </Card>
    </div>
  )
} 