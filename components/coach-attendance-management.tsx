"use client"

import React, { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useCenterContext } from "@/context/center-context"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CheckCircle, XCircle, AlertCircle, Users, Clock, CalendarIcon, UserCheck, GraduationCap } from "lucide-react"
import { format } from "date-fns"

interface CoachBatch {
  id: string
  name: string
  start_time: string | null
  end_time: string | null
  student_count: number
  center_name: string
  description: string | null
}

interface Student {
  id: string
  full_name: string
  age: number
  batch_id: string
}

interface AttendanceRecord {
  student_id: string
  status: "present" | "absent"
}

interface ExistingAttendance {
  student_id: string
  status: "present" | "absent"
}

export default function CoachAttendanceManagement() {
  const { user, selectedCenter, loading: contextLoading } = useCenterContext()
  const [coachBatches, setCoachBatches] = useState<CoachBatch[]>([])
  const [selectedBatch, setSelectedBatch] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [existingAttendance, setExistingAttendance] = useState<ExistingAttendance[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Load coach's assigned batches
  useEffect(() => {
    if (user?.role === 'coach' && user?.id) {
      loadCoachBatches()
    }
  }, [user])

  // Load students when batch changes
  useEffect(() => {
    if (selectedBatch) {
      loadStudents()
      loadExistingAttendance()
    }
  }, [selectedBatch, selectedDate])

  const loadCoachBatches = async () => {
    setLoading(true)
    setError("")
    
    try {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }

      // Get batches assigned to this coach
      const { data, error } = await supabase
        .from("batches")
        .select(`
          id,
          name,
          start_time,
          end_time,
          description,
          center_id,
          centers!inner(name),
          students(count)
        `)
        .eq("coach_id", user.id)
        .order("start_time", { ascending: true, nullsFirst: false })

      if (error) throw error

      const formattedBatches: CoachBatch[] = (data || []).map((batch: any) => ({
        id: batch.id,
        name: batch.name,
        start_time: batch.start_time,
        end_time: batch.end_time,
        description: batch.description,
        center_name: batch.centers?.name || "Unknown Center",
        student_count: Array.isArray(batch.students) ? batch.students.length : 0
      }))

      setCoachBatches(formattedBatches)

      // Auto-select first batch if available
      if (formattedBatches.length > 0 && !selectedBatch) {
        setSelectedBatch(formattedBatches[0].id)
      }

    } catch (error: any) {
      console.error('Error loading coach batches:', error)
      setError(error.message || "Failed to load your assigned batches")
    } finally {
      setLoading(false)
    }
  }

  const loadStudents = async () => {
    if (!selectedBatch) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("students")
        .select("id, full_name, age, batch_id")
        .eq("batch_id", selectedBatch)
        .order("full_name")

      if (error) throw error
      
      setStudents(data || [])

      // Initialize attendance records for all students
      const initialAttendance: AttendanceRecord[] = (data || []).map(student => ({
        student_id: student.id,
        status: "present" as const,
      }))
      setAttendance(initialAttendance)

    } catch (error: any) {
      console.error('Error loading students:', error)
      setError(error.message || "Failed to load students")
    } finally {
      setLoading(false)
    }
  }

  const loadExistingAttendance = async () => {
    if (!selectedBatch) return

    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      
      const { data, error } = await supabase
        .from("attendance")
        .select("student_id, status")
        .eq("batch_id", selectedBatch)
        .eq("date", dateStr)

      if (error) throw error

      if (data && data.length > 0) {
        setExistingAttendance(data)
        
        // Update attendance state with existing records
        setAttendance(prev => prev.map(record => {
          const existing = data.find(ex => ex.student_id === record.student_id)
          return existing ? { ...record, status: existing.status } : record
        }))
      } else {
        setExistingAttendance([])
      }

    } catch (error: any) {
      console.error("Error loading existing attendance:", error)
    }
  }

  const updateAttendance = (studentId: string, status: "present" | "absent") => {
    setAttendance(prev => 
      prev.map(record => 
        record.student_id === studentId ? { ...record, status } : record
      )
    )
  }

  const saveAttendance = async () => {
    if (!selectedBatch || !user?.id) return

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd")

      // Delete existing attendance for this batch and date
      await supabase
        .from("attendance")
        .delete()
        .eq("batch_id", selectedBatch)
        .eq("date", dateStr)

      // Insert new attendance records
      const attendanceRecords = attendance.map(record => ({
        student_id: record.student_id,
        batch_id: selectedBatch,
        date: dateStr,
        status: record.status,
        marked_by: user.id,
        center_id: user.center_id
      }))

      const { error } = await supabase
        .from("attendance")
        .insert(attendanceRecords)

      if (error) throw error

      setSuccess("Attendance saved successfully!")
      setExistingAttendance(attendance)

    } catch (error: any) {
      console.error('Error saving attendance:', error)
      setError(error.message || "Failed to save attendance")
    } finally {
      setSaving(false)
    }
  }

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "Time TBD"
    try {
      // Parse time string (assuming format like "10:00:00")
      const [hours, minutes] = timeStr.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    } catch {
      return timeStr
    }
  }

  const getBatchTimeDisplay = (batch: CoachBatch) => {
    if (batch.start_time && batch.end_time) {
      return `${formatTime(batch.start_time)} - ${formatTime(batch.end_time)}`
    } else if (batch.start_time) {
      return `${formatTime(batch.start_time)}`
    } else {
      return "Time TBD"
    }
  }

  const selectedBatchInfo = coachBatches.find(b => b.id === selectedBatch)

  // Loading state
  if (contextLoading || (loading && coachBatches.length === 0)) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-600"></div>
          <p className="text-sm text-gray-600">Loading your assigned batches...</p>
        </div>
      </div>
    )
  }

  // No batches assigned
  if (coachBatches.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <GraduationCap className="h-6 w-6" />
              Attendance Management
            </CardTitle>
            <CardDescription>Mark attendance for your assigned batches</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">No Batches Assigned</h3>
                <p className="text-gray-600 mt-1">
                  You don't have any batches assigned to you yet. Please contact your manager to get batch assignments.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <UserCheck className="h-6 w-6" />
            Attendance Management
          </CardTitle>
          <CardDescription>
            Mark attendance for your assigned batches
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Batch Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Batch & Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Batch Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Assigned Batches</label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a batch" />
                </SelectTrigger>
                <SelectContent>
                  {coachBatches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{batch.name}</span>
                        <span className="text-xs text-gray-500">
                          {getBatchTimeDisplay(batch)} • {batch.student_count} students • {batch.center_name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Selected Batch Info */}
          {selectedBatchInfo && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-medium">{selectedBatchInfo.name}</h4>
                  <p className="text-sm text-gray-600">{selectedBatchInfo.center_name}</p>
                  {selectedBatchInfo.description && (
                    <p className="text-sm text-gray-500 mt-1">{selectedBatchInfo.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {getBatchTimeDisplay(selectedBatchInfo)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {selectedBatchInfo.student_count} students
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Marking */}
      {selectedBatch && students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Mark Attendance - {format(selectedDate, "PPP")}</span>
              {existingAttendance.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Previously recorded
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Click Present or Absent for each student
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((student) => {
                const studentAttendance = attendance.find(a => a.student_id === student.id)
                const isPresent = studentAttendance?.status === "present"

                return (
                  <div 
                    key={student.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{student.full_name}</h4>
                      <p className="text-sm text-gray-600">Age: {student.age}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant={isPresent ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateAttendance(student.id, "present")}
                        className={isPresent ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-50 hover:text-green-700 hover:border-green-300"}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Present
                      </Button>
                      <Button
                        variant={!isPresent ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => updateAttendance(student.id, "absent")}
                        className={!isPresent ? "" : "hover:bg-red-50 hover:text-red-700 hover:border-red-300"}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Absent
                      </Button>
                    </div>
                  </div>
                )
              })}

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={saveAttendance} 
                  disabled={saving}
                  className="bg-burgundy-600 hover:bg-burgundy-700"
                >
                  {saving ? "Saving..." : "Save Attendance"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Students */}
      {selectedBatch && students.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="flex flex-col items-center space-y-4">
              <Users className="h-12 w-12 text-gray-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">No Students in This Batch</h3>
                <p className="text-gray-600 mt-1">
                  This batch doesn't have any students enrolled yet.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
