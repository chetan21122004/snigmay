"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
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

interface Batch {
  id: string
  name: string
  description: string | null
  coach_id: string | null
  coach_name?: string
}

interface Coach {
  id: string
  full_name: string
}

export function BatchManagement() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coach_id: "none", // Updated default value to 'none'
  })
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load batches with coach names
      const { data: batchData, error: batchError } = await supabase
        .from("batches")
        .select(`
          *,
          users:coach_id (
            full_name
          )
        `)
        .order("created_at", { ascending: false })

      if (batchError) throw batchError

      const batchesWithCoachNames =
        batchData?.map((batch) => ({
          ...batch,
          coach_name: batch.users?.full_name || "Unassigned",
        })) || []

      setBatches(batchesWithCoachNames)

      // Load coaches
      const { data: coachData, error: coachError } = await supabase
        .from("users")
        .select("id, full_name")
        .eq("role", "coach")

      if (coachError) throw coachError
      setCoaches(coachData || [])
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
      const batchData = {
        name: formData.name,
        description: formData.description || null,
        coach_id: formData.coach_id === "none" ? null : formData.coach_id, // Updated to handle 'none' value
      }

      if (editingBatch) {
        const { error } = await supabase.from("batches").update(batchData).eq("id", editingBatch.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("batches").insert(batchData)

        if (error) throw error
      }

      setDialogOpen(false)
      setEditingBatch(null)
      setFormData({ name: "", description: "", coach_id: "none" }) // Reset form data to 'none'
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
      coach_id: batch.coach_id || "none", // Updated to handle 'none' value
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this batch?")) return

    try {
      const { error } = await supabase.from("batches").delete().eq("id", id)

      if (error) throw error
      loadData()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const resetForm = () => {
    setEditingBatch(null)
    setFormData({ name: "", description: "", coach_id: "none" }) // Reset form data to 'none'
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
        <h3 className="text-lg font-semibold">Batches</h3>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBatch ? "Edit Batch" : "Add New Batch"}</DialogTitle>
              <DialogDescription>
                {editingBatch ? "Update batch information" : "Create a new training batch"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Batch Name</Label>
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
                />
              </div>
              <div>
                <Label htmlFor="coach">Assign Coach</Label>
                <Select
                  value={formData.coach_id}
                  onValueChange={(value) => setFormData({ ...formData, coach_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a coach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No coach assigned</SelectItem> {/* Updated value to 'none' */}
                    {coaches.map((coach) => (
                      <SelectItem key={coach.id} value={coach.id}>
                        {coach.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Coach</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batches.map((batch) => (
            <TableRow key={batch.id}>
              <TableCell className="font-medium">{batch.name}</TableCell>
              <TableCell>{batch.description || "No description"}</TableCell>
              <TableCell>{batch.coach_name}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
