"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

interface Batch {
  id: string
  name: string
  description: string | null
  coach_id: string | null
  coach_name?: string
  center_id?: string
  center_name?: string
}

interface Coach {
  id: string
  full_name: string
}

interface Center {
  id: string
  name: string
  location: string
}

export function BatchManagement() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coach_id: "none",
    center_id: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load batches using API endpoint
      const batchesResponse = await fetch('/api/batches')
      if (!batchesResponse.ok) {
        throw new Error('Failed to fetch batches')
      }
      const batchesData = await batchesResponse.json()
      setBatches(batchesData)

      // Load centers using API endpoint
      const centersResponse = await fetch('/api/centers')
      if (!centersResponse.ok) {
        throw new Error('Failed to fetch centers')
      }
      const centersData = await centersResponse.json()
      setCenters(centersData)

      // Load coaches - we'll need to create this endpoint or use a direct query
      const coachesResponse = await fetch('/api/users?role=coach')
      if (coachesResponse.ok) {
        const coachesData = await coachesResponse.json()
        setCoaches(coachesData)
      } else {
        // Fallback to empty array if endpoint doesn't exist
        setCoaches([])
      }

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

    if (!formData.center_id) {
      setError("Please select a center")
      return
    }

    try {
      const batchData = {
        name: formData.name,
        description: formData.description || null,
        coach_id: formData.coach_id === "none" ? null : formData.coach_id,
        center_id: formData.center_id,
      }

      const url = editingBatch ? `/api/batches/${editingBatch.id}` : '/api/batches'
      const method = editingBatch ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save batch')
      }

      setDialogOpen(false)
      setEditingBatch(null)
      resetForm()
      loadData()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleEdit = (batch: Batch) => {
    setEditingBatch(batch)
    setFormData({
      name: batch.name,
      description: batch.description || "",
      coach_id: batch.coach_id || "none",
      center_id: batch.center_id || "",
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this batch?")) return

    try {
      const response = await fetch(`/api/batches/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete batch')
      }

      loadData()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const resetForm = () => {
    setEditingBatch(null)
    setFormData({
      name: "",
      description: "",
      coach_id: "none",
      center_id: "",
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
            <CardTitle>Batch Management</CardTitle>
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
                  Add Batch
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingBatch ? "Edit Batch" : "Add New Batch"}</DialogTitle>
                  <DialogDescription>
                    {editingBatch ? "Update batch information" : "Create a new training batch"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Batch Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the batch (age group, skill level, etc.)"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="center">Center *</Label>
                      <Select
                        value={formData.center_id}
                        onValueChange={(value) => setFormData({ ...formData, center_id: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a center" />
                        </SelectTrigger>
                        <SelectContent>
                          {centers.map((center) => (
                            <SelectItem key={center.id} value={center.id}>
                              {center.location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="coach">Assign Coach</Label>
                      <Select
                        value={formData.coach_id}
                        onValueChange={(value) => setFormData({ ...formData, coach_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a coach (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No coach assigned</SelectItem>
                          {coaches.map((coach) => (
                            <SelectItem key={coach.id} value={coach.id}>
                              {coach.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingBatch ? "Update" : "Create"}</Button>
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
                <TableHead>Description</TableHead>
                <TableHead>Center</TableHead>
                <TableHead>Coach</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No batches found. Create your first batch to get started.
                  </TableCell>
                </TableRow>
              ) : (
                batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.name}</TableCell>
                    <TableCell>{batch.description || "No description"}</TableCell>
                    <TableCell>{batch.center_name || "Unknown Center"}</TableCell>
                    <TableCell>{batch.coach_name || "Unassigned"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(batch)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(batch.id)}>
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
