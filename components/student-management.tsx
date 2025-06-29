"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Student {
  id: string
  name: string
  age: number
  contact_info: string | null
  batch_id: string | null
  batch_name?: string
}

interface Batch {
  id: string
  name: string
}

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    contact_info: "",
    batch_id: "none", // Updated default value to 'none'
  })
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load students with batch names
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select(`
          *,
          batches:batch_id (
            name
          )
        `)
        .order("created_at", { ascending: false })

      if (studentError) throw studentError

      const studentsWithBatchNames =
        studentData?.map((student) => ({
          ...student,
          batch_name: student.batches?.name || "No batch assigned",
        })) || []

      setStudents(studentsWithBatchNames)

      // Load batches
      const { data: batchData, error: batchError } = await supabase.from("batches").select("id, name").order("name")

      if (batchError) throw batchError
      setBatches(batchData || [])
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const studentData = {
        name: formData.name,
        age: Number.parseInt(formData.age),
        contact_info: formData.contact_info || null,
        batch_id: formData.batch_id === "none" ? null : formData.batch_id, // Updated to handle 'none' value
      }

      if (editingStudent) {
        const { error } = await supabase.from("students").update(studentData).eq("id", editingStudent.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("students").insert(studentData)

        if (error) throw error
      }

      setDialogOpen(false)
      setEditingStudent(null)
      setFormData({ name: "", age: "", contact_info: "", batch_id: "none" }) // Reset to 'none'
      loadData()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      age: student.age.toString(),
      contact_info: student.contact_info || "",
      batch_id: student.batch_id || "none", // Updated to handle 'none' value
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return

    try {
      const { error } = await supabase.from("students").delete().eq("id", id)

      if (error) throw error
      loadData()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const resetForm = () => {
    setEditingStudent(null)
    setFormData({ name: "", age: "", contact_info: "", batch_id: "none" }) // Reset to 'none'
    setError("")
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Students</h3>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
              <DialogDescription>
                {editingStudent ? "Update student information" : "Register a new student"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Student Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="5"
                  max="25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_info">Contact Information</Label>
                <Input
                  id="contact_info"
                  value={formData.contact_info}
                  onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                  placeholder="Email, phone number, etc."
                />
              </div>
              <div>
                <Label htmlFor="batch">Assign to Batch</Label>
                <Select
                  value={formData.batch_id}
                  onValueChange={(value) => setFormData({ ...formData, batch_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No batch assigned</SelectItem> {/* Updated value prop */}
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingStudent ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.age}</TableCell>
              <TableCell>{student.contact_info || "No contact info"}</TableCell>
              <TableCell>{student.batch_name}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(student)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(student.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
