'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Activity,
  Users, 
  Calendar as CalendarIcon,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download
} from 'lucide-react'
import { useCenterContext } from '@/context/center-context'

interface DashboardStats {
  totalStudents: number
  totalBatches: number
  attendanceRate: number
  feeCollection: number
  recentPayments: any[]
  upcomingBatches: any[]
  attendanceToday: any[]
}

export default function CenterManagerDashboard() {
  const { selectedCenter, getStudentsByCenter, getBatchesByCenter, getAttendanceByCenter, getFeesByCenter } = useCenterContext()
  const [date, setDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false)

  // Calculate stats based on center data
  const stats = useMemo((): DashboardStats => {
    if (!selectedCenter) {
      return {
    totalStudents: 0,
    totalBatches: 0,
    attendanceRate: 0,
        feeCollection: 0,
        recentPayments: [],
        upcomingBatches: [],
        attendanceToday: []
      }
    }

    const centerStudents = getStudentsByCenter(selectedCenter.id)
    const centerBatches = getBatchesByCenter(selectedCenter.id)
    const centerAttendance = getAttendanceByCenter(selectedCenter.id)
    const centerFees = getFeesByCenter(selectedCenter.id)

    // Calculate attendance rate (last 30 days)
    const attendanceRate = centerAttendance.length > 0
      ? (centerAttendance.filter(a => a.status === 'present').length / centerAttendance.length) * 100
      : 0

    // Calculate fee collection
    const feeCollection = centerFees
      .filter(f => f.status === 'paid')
      .reduce((sum, f) => sum + f.amount, 0)

    // Get recent payments (last 5)
    const recentPayments = centerFees
      .filter(f => f.status === 'paid')
      .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
      .slice(0, 5)
      .map(payment => ({
        ...payment,
        student_name: centerStudents.find(s => s.id === payment.student_id)?.full_name || 'Unknown Student'
      }))

      // Get today's attendance
    const today = new Date().toISOString().split('T')[0]
    const attendanceToday = centerAttendance
      .filter(a => a.date === today)
      .map(record => ({
        ...record,
        student_name: centerStudents.find(s => s.id === record.student_id)?.full_name || 'Unknown Student',
        batch_name: centerBatches.find(b => b.id === record.batch_id)?.name || 'Unknown Batch'
      }))

    // Mock upcoming batches (in a real app, this would be calculated based on schedule)
    const upcomingBatches = centerBatches.slice(0, 5).map(batch => ({
      ...batch,
      coach_name: 'Coach Name' // This would come from a join with users table
    }))

          return {
      totalStudents: centerStudents.length,
      totalBatches: centerBatches.length,
        attendanceRate,
      feeCollection,
        recentPayments,
      upcomingBatches,
      attendanceToday
    }
  }, [selectedCenter, getStudentsByCenter, getBatchesByCenter, getAttendanceByCenter, getFeesByCenter])

  if (!selectedCenter) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Center Selected</h3>
          <p className="text-gray-500">Please select a center to view the dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-8">
      {/* Center Header */}
        <div className="flex items-center justify-between">
              <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedCenter.name}
            </h1>
          <p className="text-gray-500 mt-1">{selectedCenter.location}</p>
        </div>
        <Button className="bg-burgundy-600 hover:bg-burgundy-700">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
            </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalStudents}
                </h3>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={Math.min((stats.totalStudents / 50) * 100, 100)} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((stats.totalStudents / 50) * 100)}% capacity utilized
            </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Batches</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalBatches}
                </h3>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={Math.min((stats.totalBatches / 10) * 100, 100)} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((stats.totalBatches / 10) * 100)}% time slots filled
              </p>
            </div>
            </CardContent>
          </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Attendance Rate</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.attendanceRate.toFixed(1)}%
                </h3>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-purple-500" />
              </div>
        </div>
            <div className="mt-4">
              <Progress value={stats.attendanceRate} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">Last 30 days average</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                <p className="text-sm font-medium text-gray-500">Fee Collection</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  ₹{stats.feeCollection.toLocaleString()}
                </h3>
                    </div>
              <div className="h-12 w-12 bg-yellow-50 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-yellow-500" />
                    </div>
                </div>
            <div className="mt-4">
              <Progress value={85} className="h-2" />
              <p className="text-xs text-gray-500 mt-2">85% collection target</p>
                </div>
              </CardContent>
            </Card>
          </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Schedule */}
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Upcoming training sessions</CardDescription>
              </CardHeader>
              <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {stats.upcomingBatches.length > 0 ? (
                    stats.upcomingBatches.map((batch, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="h-12 w-12 bg-burgundy-100 rounded-lg flex items-center justify-center">
                          <Clock className="h-6 w-6 text-burgundy-600" />
                  </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">{batch.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{batch.start_time || '09:00'}</span>
                            <span>-</span>
                            <span>{batch.end_time || '10:30'}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          {batch.coach_name}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No sessions scheduled for today</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              </CardContent>
            </Card>

          {/* Attendance Overview */}
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Today's Attendance
              </CardTitle>
              <CardDescription>Student attendance status</CardDescription>
              </CardHeader>
              <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {stats.attendanceToday.length > 0 ? (
                    stats.attendanceToday.map((record, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>{record.student_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">{record.student_name}</h4>
                          <p className="text-sm text-gray-500">{record.batch_name}</p>
                  </div>
                        <div className="flex items-center gap-2">
                          {record.status === 'present' ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Present
                            </Badge>
                          ) : record.status === 'absent' ? (
                            <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">
                              <XCircle className="h-4 w-4 mr-1" />
                              Absent
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Not Marked
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No attendance records for today</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              </CardContent>
            </Card>
          </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Schedule overview</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Payments
              </CardTitle>
              <CardDescription>Latest fee collections</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {stats.recentPayments.length > 0 ? (
                    stats.recentPayments.map((payment, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">₹{payment.amount.toLocaleString()}</h4>
                          <p className="text-sm text-gray-500">{payment.student_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">
                            {new Date(payment.payment_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {payment.payment_mode}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
              <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No recent payments</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
} 