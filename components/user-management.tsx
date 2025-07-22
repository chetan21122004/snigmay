"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { UserRole } from "@/lib/auth"
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Key, 
  Search, 
  Filter,
  UserPlus,
  Shield,
  GraduationCap,
  UserCog,
  Building,
  Eye,
  EyeOff,
  MapPin,
  Mail,
  Phone,
  Calendar
} from "lucide-react"

interface Coach {
  id: string
  full_name: string
  email: string
  role: UserRole
  center_id: string | null
  center_name: string
  created_at?: string
}

interface Center {
  id: string
  name: string
  location: string
}

const roleConfig = {
  super_admin: {
    label: "Super Administrator",
    description: "Full system access and control",
    icon: Shield,
    color: "bg-red-500 text-white",
    requiresCenter: false
  },
  club_manager: {
    label: "Club Manager", 
    description: "Attendance and financial oversight across all centers",
    icon: Users,
    color: "bg-blue-500 text-white",
    requiresCenter: false
  },
  head_coach: {
    label: "Head Coach",
    description: "Training performance oversight across all centers", 
    icon: GraduationCap,
    color: "bg-green-500 text-white",
    requiresCenter: false
  },
  coach: {
    label: "Coach",
    description: "Center-specific batch and student management",
    icon: UserCog,
    color: "bg-purple-500 text-white",
    requiresCenter: true
  },
  center_manager: {
    label: "Center Manager",
    description: "Single center operational coordination",
    icon: Building,
    color: "bg-orange-500 text-white",
    requiresCenter: true
  }
}

export default function UserManagement() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [centers, setCenters] = useState<Center[]>([])
  const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState<{ open: boolean; coach?: Coach }>({ open: false })
  const [showReset, setShowReset] = useState<{ open: boolean; coach?: Coach }>({ open: false })
  const [showDelete, setShowDelete] = useState<{ open: boolean; coach?: Coach }>({ open: false })
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [centerFilter, setCenterFilter] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  
  const [form, setForm] = useState<{
    email: string
    fullName: string
    password: string
    role: UserRole
    centerId: string
  }>({ email: "", fullName: "", password: "", role: "coach", centerId: "" })
  
  const [resetPassword, setResetPassword] = useState("")
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoad()
  }, [router])

  useEffect(() => {
    filterCoaches()
  }, [coaches, searchTerm, roleFilter, centerFilter])

  const checkAuthAndLoad = async () => {
    try {
      const user = await getCurrentUser()
      if (!user || user.role !== "super_admin") {
        router.push("/unauthorized")
        return
      }
      await Promise.all([loadCoaches(), loadCenters()])
    } catch (error) {
      console.error("Error loading data:", error)
      toast({ title: "Error loading data", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const loadCoaches = async () => {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch coaches")
      const data = await response.json()
      setCoaches(data)
    } catch (error) {
      console.error("Error loading coaches:", error)
      toast({ title: "Error loading coaches", variant: "destructive" })
    }
  }

  const loadCenters = async () => {
    try {
      const response = await fetch("/api/centers")
      if (!response.ok) throw new Error("Failed to fetch centers")
      const data = await response.json()
      setCenters(data)
    } catch (error) {
      console.error("Error loading centers:", error)
      toast({ title: "Error loading centers", variant: "destructive" })
    }
  }

  const filterCoaches = () => {
    let filtered = coaches

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(coach =>
        coach.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter(coach => coach.role === roleFilter)
    }

    // Filter by center
    if (centerFilter && centerFilter !== "") {
      filtered = filtered.filter(coach => coach.center_id === centerFilter)
    }

    setFilteredCoaches(filtered)
  }

  const handleCreate = async () => {
    if (!form.email || !form.fullName || !form.password || !form.role) {
      toast({ title: "All fields are required", variant: "destructive" })
      return
    }

    const selectedRole = roleConfig[form.role]
    if (selectedRole?.requiresCenter && !form.centerId) {
      toast({ title: "This role requires a center assignment", variant: "destructive" })
      return
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role,
          center_id: form.centerId || null
        })
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Failed to create coach")
      }

      toast({ title: "Coach created successfully" })
      setShowCreate(false)
      resetForm()
      await loadCoaches()
    } catch (error: any) {
      toast({ title: error.message, variant: "destructive" })
    }
  }

  const handleUpdate = async () => {
    if (!showEdit.coach || !form.email || !form.fullName || !form.role) {
      toast({ title: "All fields are required", variant: "destructive" })
      return
    }

    const selectedRole = roleConfig[form.role]
    if (selectedRole?.requiresCenter && !form.centerId) {
      toast({ title: "This role requires a center assignment", variant: "destructive" })
      return
    }

    try {
      const updateData: any = {
        full_name: form.fullName,
        email: form.email,
        role: form.role,
        center_id: form.centerId || null
      }

      if (form.password) {
        updateData.password = form.password
      }

      const response = await fetch(`/api/users/${showEdit.coach.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Failed to update coach")
      }

      toast({ title: "Coach updated successfully" })
      setShowEdit({ open: false })
      resetForm()
      await loadCoaches()
    } catch (error: any) {
      toast({ title: error.message, variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!showDelete.coach) return

    try {
      const response = await fetch(`/api/users/${showDelete.coach.id}`, {
        method: "DELETE"
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete coach")
      }

      toast({ title: "Coach deleted successfully" })
      setShowDelete({ open: false })
      await loadCoaches()
    } catch (error: any) {
      toast({ title: error.message, variant: "destructive" })
    }
  }

  const handleResetPassword = async () => {
    if (!resetPassword || !showReset.coach) {
      toast({ title: "Please enter a new password", variant: "destructive" })
      return
    }

    try {
      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: showReset.coach.id,
          newPassword: resetPassword
        })
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "Failed to reset password")
      }

      toast({ title: "Password reset successfully" })
      setShowReset({ open: false })
      setResetPassword("")
    } catch (error: any) {
      toast({ title: error.message, variant: "destructive" })
    }
  }

  const resetForm = () => {
    setForm({ email: "", fullName: "", password: "", role: "coach", centerId: "" })
    setShowPassword(false)
  }

  const openEditDialog = (coach: Coach) => {
    setForm({
      email: coach.email,
      fullName: coach.full_name,
      password: "",
      role: coach.role,
      centerId: coach.center_id || ""
    })
    setShowEdit({ open: true, coach })
  }

  const getRoleIcon = (role: UserRole) => {
    const config = roleConfig[role]
    const Icon = config.icon
    return <Icon className="h-4 w-4" />
  }

  const getRoleBadge = (role: UserRole) => {
    const config = roleConfig[role]
    return (
      <Badge className={`${config.color} text-xs`}>
        {getRoleIcon(role)}
        <span className="ml-1">{config.label}</span>
      </Badge>
    )
  }

  const getStats = () => {
    const totalCoaches = coaches.length
    const roleStats = Object.keys(roleConfig).map(role => ({
      role: role as UserRole,
      count: coaches.filter(c => c.role === role).length,
      label: roleConfig[role as UserRole].label
    })).filter(stat => stat.count > 0)

    return { totalCoaches, roleStats }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Coach Management</h1>
            <p className="text-gray-600 mt-1">Manage coaches and staff members across all centers</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="self-start sm:self-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Coach
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Coaches</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCoaches}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          {stats.roleStats.slice(0, 3).map((stat) => (
            <Card key={stat.role}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                  </div>
                  {getRoleIcon(stat.role)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search coaches by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {Object.entries(roleConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={centerFilter} onValueChange={setCenterFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by center" />
                </SelectTrigger>
                <SelectContent>
                  {centers.map((center) => (
                    <SelectItem key={center.id} value={center.id}>{center.location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Coaches List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Coaches ({filteredCoaches.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCoaches.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No coaches found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium text-gray-600">Coach</th>
                          <th className="text-left p-3 font-medium text-gray-600">Role</th>
                          <th className="text-left p-3 font-medium text-gray-600">Center</th>
                          <th className="text-right p-3 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCoaches.map((coach) => (
                          <tr key={coach.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div>
                                <p className="font-medium text-gray-900">{coach.full_name}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {coach.email}
                                </p>
                              </div>
                            </td>
                            <td className="p-3">
                              {getRoleBadge(coach.role)}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="h-3 w-3" />
                                {coach.center_name}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditDialog(coach)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setShowReset({ open: true, coach })}
                                >
                                  <Key className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setShowDelete({ open: true, coach })}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {filteredCoaches.map((coach) => (
                    <Card key={coach.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900">{coach.full_name}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                              <Mail className="h-3 w-3" />
                              {coach.email}
                            </p>
                          </div>
                          {getRoleBadge(coach.role)}
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                          <MapPin className="h-3 w-3" />
                          {coach.center_name}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(coach)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowReset({ open: true, coach })}
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowDelete({ open: true, coach })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Coach Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Coach
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={form.role} onValueChange={(val) => setForm(f => ({ ...f, role: val as UserRole }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(key as UserRole)}
                        <div>
                          <p className="font-medium">{config.label}</p>
                          <p className="text-xs text-gray-500">{config.description}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {roleConfig[form.role]?.requiresCenter && (
              <div>
                <Label htmlFor="center">Center</Label>
                <Select value={form.centerId} onValueChange={(val) => setForm(f => ({ ...f, centerId: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select center" />
                  </SelectTrigger>
                  <SelectContent>
                    {centers.map((center) => (
                      <SelectItem key={center.id} value={center.id}>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{center.name}</p>
                            <p className="text-xs text-gray-500">{center.location}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              Create Coach
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Coach Dialog */}
      <Dialog open={showEdit.open} onOpenChange={(open) => setShowEdit({ open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Coach
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editFullName">Full Name</Label>
              <Input
                id="editFullName"
                value={form.fullName}
                onChange={(e) => setForm(f => ({ ...f, fullName: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="editPassword">New Password (optional)</Label>
              <div className="relative">
                <Input
                  id="editPassword"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Leave blank to keep current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="editRole">Role</Label>
              <Select value={form.role} onValueChange={(val) => setForm(f => ({ ...f, role: val as UserRole }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(key as UserRole)}
                        <div>
                          <p className="font-medium">{config.label}</p>
                          <p className="text-xs text-gray-500">{config.description}</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {roleConfig[form.role]?.requiresCenter && (
              <div>
                <Label htmlFor="editCenter">Center</Label>
                <Select value={form.centerId} onValueChange={(val) => setForm(f => ({ ...f, centerId: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select center" />
                  </SelectTrigger>
                  <SelectContent>
                    {centers.map((center) => (
                      <SelectItem key={center.id} value={center.id}>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{center.name}</p>
                            <p className="text-xs text-gray-500">{center.location}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit({ open: false })}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              Update Coach
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showReset.open} onOpenChange={(open) => setShowReset({ open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Reset Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="coach-info">Coach</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{showReset.coach?.full_name}</p>
                <p className="text-sm text-gray-600">{showReset.coach?.email}</p>
              </div>
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showResetPassword ? "text" : "password"}
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowResetPassword(!showResetPassword)}
                >
                  {showResetPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReset({ open: false })}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Coach Dialog */}
      <Dialog open={showDelete.open} onOpenChange={(open) => setShowDelete({ open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete Coach
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-medium">Are you sure you want to delete this coach?</p>
              <p className="text-red-600 text-sm mt-1">This action cannot be undone.</p>
            </div>
            <div>
              <Label>Coach Details</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{showDelete.coach?.full_name}</p>
                <p className="text-sm text-gray-600">{showDelete.coach?.email}</p>
                <p className="text-sm text-gray-600">{showDelete.coach?.center_name}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete({ open: false })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Coach
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 