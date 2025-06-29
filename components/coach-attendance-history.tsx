"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface AttendanceRecord {
  id: string
  date: string
  status: "present" | "absent"
  student_name: string
}

interface Batch {
  id: string
  name: string
}

interface CoachAttendanceHistoryProps {
  batches: Batch[]
}

export function CoachAttendanceHistory({ batches }: CoachAttendanceHistoryProps) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [selectedBatch, setSelectedBatch] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedBatch) {
      loadAttendanceHistory()
    }
  }, [selectedBatch])

  const loadAttendanceHistory = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select(`
          id,
          date,
          status,
          students:student_id (
            name
          )
        `)
        .eq("batch_id", selectedBatch)
        .order("date", { ascending: false })

      if (error) throw error

      const formattedRecords =
        data?.map((record) => ({
          id: record.id,
          date: record.date,
          status: record.status,
          student_name: record.students?.name || "Unknown",
        })) || []

      setAttendanceRecords(formattedRecords)
    } catch (error) {
      console.error("Error loading attendance history:", error)
    } finally {
      setLoading(false)
    }
  }

  const presentCount = attendanceRecords.filter((r) => r.status === "present").length
  const absentCount = attendanceRecords.filter((r) => r.status === "absent").length

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Select Batch</label>
        <Select value={selectedBatch} onValueChange={setSelectedBatch}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Choose a batch" />
          </SelectTrigger>
          <SelectContent>
            {batches.map((batch) => (
              <SelectItem key={batch.id} value={batch.id}>
                {batch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedBatch && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Absent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{absentCount}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                        <TableCell className="font-medium">{record.student_name}</TableCell>
                        <TableCell>
                          <Badge variant={record.status === "present" ? "default" : "destructive"}>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {!loading && attendanceRecords.length === 0 && (
                <div className="text-center py-8 text-gray-500">No attendance records found for this batch.</div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
