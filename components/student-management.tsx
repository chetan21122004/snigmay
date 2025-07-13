"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Student {
  id: string
  name: string
  age: number
  contact_info: string | null
  batch_id: string | null
  batch_name?: string
  center_name?: string
}

interface Batch {
  id: string
  name: string
  center_name?: string
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
    batch_id: "none",
    parent_name: "",
    parent_phone: "",
    parent_email: "",
    address: "",
    emergency_contact: "",
    medical_conditions: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load students using API endpoint
      const studentsResponse = await fetch('/api/students')
      if (!studentsResponse.ok) {
        throw new Error('Failed to fetch students')
      }
      const studentsData = await studentsResponse.json()
      setStudents(studentsData)

      // Load batches using API endpoint
      const batchesResponse = await fetch('/api/batches')
      if (!batchesResponse.ok) {
        throw new Error('Failed to fetch batches')
      }
      const batchesData = await batchesResponse.json()
      setBatches(batchesData)

    } catch (error: any) {
      console.error("Error loading data:", error)
      setError("Failed to load data: " + error.message)
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
        age: parseInt(formData.age),
        contact_info: formData.contact_info || null,
        batch_id: formData.batch_id === "none" ? null : formData.batch_id,
        parent_name: formData.parent_name || null,
        parent_phone: formData.parent_phone || null,
        parent_email: formData.parent_email || null,
        address: formData.address || null,
        emergency_contact: formData.emergency_contact || null,
        medical_conditions: formData.medical_conditions || null,
      }

      const url = editingStudent ? `/api/students/${editingStudent.id}` : '/api/students'
      const method = editingStudent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save student')
      }

      setDialogOpen(false)
      setEditingStudent(null)
      resetForm()
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
      batch_id: student.batch_id || "none",
      parent_name: "",
      parent_phone: "",
      parent_email: "",
      address: "",
      emergency_contact: "",
      medical_conditions: "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete student')
      }

      loadData()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const resetForm = () => {
    setEditingStudent(null)
    setFormData({
      name: "",
      age: "",
      contact_info: "",
      batch_id: "none",
      parent_name: "",
      parent_phone: "",
      parent_email: "",
      address: "",
      emergency_contact: "",
      medical_conditions: "",
    })
    setError("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Student Management</CardTitle>
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
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
                  <DialogDescription>
                    {editingStudent ? "Update student information" : "Register a new student"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Student Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age *</Label>
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
                        <SelectItem value="none">No batch assigned</SelectItem>
                        {batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name} {batch.center_name && `(${batch.center_name})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="parent_name">Parent Name</Label>
                      <Input
                        id="parent_name"
                        value={formData.parent_name}
                        onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="parent_phone">Parent Phone</Label>
                      <Input
                        id="parent_phone"
                        value={formData.parent_phone}
                        onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="parent_email">Parent Email</Label>
                    <Input
                      id="parent_email"
                      type="email"
                      value={formData.parent_email}
                      onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergency_contact">Emergency Contact</Label>
                    <Input
                      id="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="medical_conditions">Medical Conditions</Label>
                    <Input
                      id="medical_conditions"
                      value={formData.medical_conditions}
                      onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
                    />
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Center</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No students found. Add your first student to get started.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.age}</TableCell>
                    <TableCell>{student.contact_info || "No contact info"}</TableCell>
                    <TableCell>{student.batch_name || "No batch assigned"}</TableCell>
                    <TableCell>{student.center_name || "Unknown Center"}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
