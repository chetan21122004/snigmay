"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, DollarSign, AlertCircle, CheckCircle, Plus, Search, Filter, IndianRupee, Receipt, Calendar, Users } from "lucide-react"
import { useCenterContext } from "@/context/center-context"

interface FeePayment {
  id: string
  student_id: string
  student_name: string
  batch_name: string
  center_name: string
  center_location: string
  amount: number
  payment_date: string
  payment_mode: string
  receipt_number: string
  status: string
  due_date: string
}

interface FeeStats {
  totalCollected: number
  totalPending: number
  totalOverdue: number
  collectionRate: number
  paidCount: number
  dueCount: number
  overdueCount: number
}

export function FeeManagement() {
  const { selectedCenter } = useCenterContext()
  const [payments, setPayments] = useState<FeePayment[]>([])
  const [stats, setStats] = useState<FeeStats>({
    totalCollected: 0,
    totalPending: 0,
    totalOverdue: 0,
    collectionRate: 0,
    paidCount: 0,
    dueCount: 0,
    overdueCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    payment_mode: "cash",
    receipt_number: ""
  })

  useEffect(() => {
    if (selectedCenter?.id) {
    loadPayments()
    }
  }, [selectedCenter])

  const loadPayments = async () => {
    if (!selectedCenter?.id) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/fees?centerId=${selectedCenter.id}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setPayments(data)
      calculateStats(data)
    } catch (error) {
      console.error("Error loading payments:", error)
      toast({
        title: "Error loading payments",
        description: "Failed to load fee payment data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (paymentsData: FeePayment[]) => {
    const paidPayments = paymentsData.filter(p => p.status === 'paid')
    const duePayments = paymentsData.filter(p => p.status === 'due')
    const overduePayments = paymentsData.filter(p => p.status === 'overdue')

    const totalCollected = paidPayments.reduce((sum, p) => sum + p.amount, 0)
    const totalPending = duePayments.reduce((sum, p) => sum + p.amount, 0)
    const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0)

    const collectionRate = paymentsData.length > 0 
      ? Math.round((paidPayments.length / paymentsData.length) * 100)
      : 0

    setStats({
      totalCollected,
      totalPending,
      totalOverdue,
      collectionRate,
      paidCount: paidPayments.length,
      dueCount: duePayments.length,
      overdueCount: overduePayments.length
    })
  }

  const handlePaymentSubmit = async () => {
    if (!selectedStudent || !paymentForm.amount) {
      toast({ 
        title: "Please fill all required fields", 
        variant: "destructive" 
      })
      return
    }

    try {
      const response = await fetch("/api/fees/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: selectedStudent.id,
          amount: parseFloat(paymentForm.amount),
          payment_mode: paymentForm.payment_mode,
          receipt_number: paymentForm.receipt_number || `RCP-${Date.now()}`
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast({ 
          title: "Payment collected successfully",
          description: `₹${paymentForm.amount} collected from ${selectedStudent.name}`
        })
        setShowPaymentDialog(false)
        resetForm()
        loadPayments()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to collect payment")
      }
    } catch (error: any) {
      toast({ 
        title: "Error collecting payment", 
        description: error.message,
        variant: "destructive" 
      })
    }
  }

  const resetForm = () => {
    setPaymentForm({
      amount: "",
      payment_mode: "cash",
      receipt_number: ""
    })
    setSelectedStudent(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>
      case "due":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Due</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentModeBadge = (mode: string) => {
    const colors = {
      cash: "bg-blue-100 text-blue-800 border-blue-200",
      upi: "bg-purple-100 text-purple-800 border-purple-200",
      bank_transfer: "bg-green-100 text-green-800 border-green-200",
      check: "bg-orange-100 text-orange-800 border-orange-200"
    }
    return (
      <Badge className={colors[mode as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"}>
        {mode.replace('_', ' ').toUpperCase()}
      </Badge>
    )
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.batch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.center_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (!selectedCenter) {
    return (
      <div className="text-center py-12">
        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Center</h3>
        <p className="text-gray-600">Please select a center from the sidebar to manage fees.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards - Mobile Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ₹{stats.totalCollected.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.paidCount} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Dues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ₹{stats.totalPending.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.dueCount} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              ₹{stats.totalOverdue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.overdueCount} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {stats.collectionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              Overall collection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search - Mobile Responsive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Fee Management
          </CardTitle>
          <CardDescription>
            Track and manage student fee payments across all centers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name, batch, or center..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="due">Due</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile-friendly table */}
          <div className="rounded-md border">
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Mode</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No fee payments found. {searchTerm || statusFilter !== "all" ? "Try adjusting your filters." : ""}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.student_name}</TableCell>
                        <TableCell>{payment.batch_name}</TableCell>
                        <TableCell>{payment.center_name}</TableCell>
                        <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(payment.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>{payment.payment_mode ? getPaymentModeBadge(payment.payment_mode) : '-'}</TableCell>
                        <TableCell>
                          {payment.status !== "paid" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedStudent({ id: payment.student_id, name: payment.student_name })
                                setShowPaymentDialog(true)
                              }}
                            >
                              Collect
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards View */}
            <div className="sm:hidden space-y-4 p-4">
              {filteredPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No fee payments found. {searchTerm || statusFilter !== "all" ? "Try adjusting your filters." : ""}
                </div>
              ) : (
                filteredPayments.map((payment) => (
                  <Card key={payment.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{payment.student_name}</h3>
                        <p className="text-sm text-muted-foreground">{payment.batch_name}</p>
                        <p className="text-xs text-muted-foreground">{payment.center_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{payment.amount.toLocaleString()}</p>
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Due: {new Date(payment.due_date).toLocaleDateString()}
                        {payment.payment_mode && (
                          <div className="mt-1">{getPaymentModeBadge(payment.payment_mode)}</div>
                        )}
                      </div>
                      {payment.status !== "paid" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedStudent({ id: payment.student_id, name: payment.student_name })
                            setShowPaymentDialog(true)
                          }}
                        >
                          Collect
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Collection Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Collect Fee Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Student</Label>
              <Input value={selectedStudent?.name || ""} disabled />
            </div>
            <div>
              <Label>Amount *</Label>
              <Input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label>Payment Mode *</Label>
              <Select
                value={paymentForm.payment_mode}
                onValueChange={(value) => setPaymentForm({ ...paymentForm, payment_mode: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Receipt Number (Optional)</Label>
              <Input
                value={paymentForm.receipt_number}
                onChange={(e) => setPaymentForm({ ...paymentForm, receipt_number: e.target.value })}
                placeholder="Auto-generated if empty"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePaymentSubmit}>
              Collect Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 