"use client"

import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Search, Filter, Download, UserCheck, UserX } from "lucide-react"

interface AttendanceRecord {
  id: string
  student_name: string
  batch_name: string
  center_name: string
  date: string
  status: 'present' | 'absent'
  marked_by: string
}

interface Batch {
  id: string
  name: string
  center_id: string
  center_name: string
}

interface Student {
  id: string
  name: string
  batch_id: string
  batch_name: string
  center_name: string
}

interface CenterAttendanceProps {
  selectedCenter: string
}

export function CenterAttendanceManagement({ selectedCenter }: CenterAttendanceProps) {
  const [user, setUser] = useState<any>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedBatch, setSelectedBatch] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [markingMode, setMarkingMode] = useState(false)

  useEffect(() => {
    loadUserAndData()
  }, [selectedCenter])

  useEffect(() => {
    if (user) {
      loadAttendanceRecords()
    }
  }, [selectedDate, selectedBatch])

  useEffect(() => {
    if (user) {
      loadStudents()
    }
  }, [selectedBatch])

  const loadUserAndData = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      
      await Promise.all([
        loadAttendanceRecords(),
        loadBatches(),
        loadStudents()
      ])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAttendanceRecords = async () => {
    try {
      const params = new URLSearchParams({
        center: selectedCenter,
        date: format(selectedDate, 'yyyy-MM-dd')
      })
      
      if (selectedBatch !== 'all') {
        params.append('batch', selectedBatch)
      }

      const response = await fetch(`/api/attendance?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch attendance records')
      }
      
      const data = await response.json()
      setAttendanceRecords(data)
    } catch (error) {
      console.error('Error loading attendance records:', error)
      // Fallback to empty array on error
      setAttendanceRecords([])
    }
  }

  const loadBatches = async () => {
    try {
      const params = new URLSearchParams({
        center: selectedCenter
      })

      const response = await fetch(`/api/batches?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch batches')
      }
      
      const data = await response.json()
      setBatches(data)
    } catch (error) {
      console.error('Error loading batches:', error)
      // Fallback to empty array on error
      setBatches([])
    }
  }

  const loadStudents = async () => {
    try {
      const params = new URLSearchParams({
        center: selectedCenter
      })
      
      if (selectedBatch !== 'all') {
        params.append('batch', selectedBatch)
      }

      const response = await fetch(`/api/students?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch students')
      }
      
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Error loading students:', error)
      // Fallback to empty array on error
      setStudents([])
    }
  }

  const markAttendance = async (studentId: string, status: 'present' | 'absent') => {
    try {
      const student = students.find(s => s.id === studentId)
      if (!student) {
        throw new Error('Student not found')
      }

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_id: studentId,
          batch_id: student.batch_id,
          date: format(selectedDate, 'yyyy-MM-dd'),
          status,
          marked_by: user?.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to mark attendance')
      }

      const result = await response.json()
      console.log(result.message)

      // Reload attendance records to reflect the change
      await loadAttendanceRecords()
    } catch (error) {
      console.error('Error marking attendance:', error)
      // You might want to show a toast notification here
    }
  }

  const exportAttendance = () => {
    // In production, this would generate and download a CSV/Excel file
    console.log('Exporting attendance data...')
  }

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesCenter = selectedCenter === 'all' || record.center_name.toLowerCase().includes(selectedCenter.toLowerCase())
    const matchesBatch = selectedBatch === 'all' || record.batch_name === selectedBatch
    const matchesSearch = record.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.batch_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCenter && matchesBatch && matchesSearch
  })

  const getFilteredBatches = () => {
    if (selectedCenter === 'all') return batches
    return batches.filter(batch => batch.center_id === selectedCenter)
  }

  const getFilteredStudents = () => {
    let filtered = students
    
    if (selectedCenter !== 'all') {
      filtered = filtered.filter(student => student.center_name.toLowerCase().includes(selectedCenter.toLowerCase()))
    }
    
    if (selectedBatch !== 'all') {
      filtered = filtered.filter(student => student.batch_name === selectedBatch)
    }
    
    return filtered
  }

  const canMarkAttendance = () => {
    return user && ['super_admin', 'club_manager', 'head_coach', 'coach', 'center_manager'].includes(user.role)
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading attendance data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Attendance Management</h2>
          <p className="text-gray-600">
            {selectedCenter === 'all' ? 'All Centers' : `${selectedCenter} Center`}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={exportAttendance} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {canMarkAttendance() && (
            <Button onClick={() => setMarkingMode(!markingMode)}>
              {markingMode ? 'View Mode' : 'Mark Attendance'}
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, 'PPP')}
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

            <div>
              <Label htmlFor="batch">Batch</Label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {getFilteredBatches().map(batch => (
                    <SelectItem key={batch.id} value={batch.name}>
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="search"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setSelectedBatch("all")
                setSearchTerm("")
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Marking Mode */}
      {markingMode && canMarkAttendance() && (
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance - {format(selectedDate, 'PPP')}</CardTitle>
            <CardDescription>Click on student names to mark their attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredStudents().map(student => (
                <div key={student.id} className="border rounded-lg p-4">
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-gray-600">{student.batch_name}</div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAttendance(student.id, 'present')}
                      className="flex-1"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAttendance(student.id, 'absent')}
                      className="flex-1"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Absent
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            Showing {filteredRecords.length} records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Center</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Marked By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map(record => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.student_name}</TableCell>
                  <TableCell>{record.batch_name}</TableCell>
                  <TableCell>{record.center_name}</TableCell>
                  <TableCell>{format(new Date(record.date), 'PPP')}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === 'present' ? 'default' : 'destructive'}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.marked_by}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No attendance records found for the selected filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 