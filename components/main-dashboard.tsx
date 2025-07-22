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
  IndianRupee,
  UserPlus,
  Check
} from "lucide-react"
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

export function MainDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-burgundy-900">Welcome to Snigmay Pune FC</h1>
          <p className="text-gray-600">Your football academy management dashboard</p>
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
            <div className="text-3xl font-bold text-burgundy-900">156</div>
            <p className="text-sm text-gray-600 mt-1">Across all centers</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-burgundy-100 hover:border-burgundy-200 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-burgundy-700">
              Active Batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-burgundy-900">12</div>
            <p className="text-sm text-gray-600 mt-1">In 3 centers</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-burgundy-100 hover:border-burgundy-200 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-burgundy-700">
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">92%</div>
            <p className="text-sm text-gray-600 mt-1">143 students present</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-burgundy-100 hover:border-burgundy-200 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-burgundy-700">
              Fee Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gold-600">₹2.4L</div>
            <p className="text-sm text-gray-600 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Center Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-burgundy-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-burgundy-900">Center Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Kharadi Center */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-burgundy-700">Kharadi Center</h3>
                  <span className="text-sm text-gray-600">65 students</span>
                </div>
                <div className="h-2 bg-burgundy-100 rounded-full">
                  <div className="h-2 bg-burgundy-600 rounded-full w-[85%]"></div>
                </div>
              </div>

              {/* Viman Nagar Center */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-burgundy-700">Viman Nagar Center</h3>
                  <span className="text-sm text-gray-600">48 students</span>
                </div>
                <div className="h-2 bg-burgundy-100 rounded-full">
                  <div className="h-2 bg-burgundy-600 rounded-full w-[75%]"></div>
                </div>
              </div>

              {/* Hadapsar Center */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-burgundy-700">Hadapsar Center</h3>
                  <span className="text-sm text-gray-600">43 students</span>
                </div>
                <div className="h-2 bg-burgundy-100 rounded-full">
                  <div className="h-2 bg-burgundy-600 rounded-full w-[70%]"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-burgundy-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-burgundy-900">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-burgundy-100 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-burgundy-600" />
                </div>
                <div>
                  <p className="text-burgundy-900">New student registered</p>
                  <p className="text-sm text-gray-600">Rahul Sharma at Kharadi Center</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-burgundy-900">Attendance marked</p>
                  <p className="text-sm text-gray-600">U-12 Batch at Viman Nagar</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gold-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-gold-600" />
                </div>
                <div>
                  <p className="text-burgundy-900">Fee payment received</p>
                  <p className="text-sm text-gray-600">₹12,000 from Priya Patel</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 