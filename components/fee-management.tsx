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
import { CreditCard, DollarSign, AlertCircle, CheckCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

interface FeePayment {
  id: string
  student_id: string
  student_name: string
  batch_name: string
  amount: number
  payment_date: string
  payment_mode: string
  receipt_number: string
  status: string
  due_date: string
}

export function FeeManagement({ selectedCenter }: { selectedCenter: string }) {
  const [payments, setPayments] = useState<FeePayment[]>([])
  const [loading, setLoading] = useState(true)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    payment_mode: "cash",
    receipt_number: ""
  })

  useEffect(() => {
    loadPayments()
  }, [selectedCenter])

  const loadPayments = async () => {
    try {
      const response = await fetch(`/api/fees?center=${selectedCenter}`)
      const data = await response.json()
      setPayments(data)
    } catch (error) {
      console.error("Error loading payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSubmit = async () => {
    if (!selectedStudent || !paymentForm.amount) {
      toast({ title: "Please fill all required fields", variant: "destructive" })
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
        toast({ title: "Payment collected successfully" })
        setShowPaymentDialog(false)
        loadPayments()
      } else {
        throw new Error("Failed to collect payment")
      }
    } catch (error) {
      toast({ title: "Error collecting payment", variant: "destructive" })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "due":
        return <Badge className="bg-yellow-100 text-yellow-800">Due</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{payments
                .filter(p => p.status === "paid")
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Dues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{payments
                .filter(p => p.status !== "paid")
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.length > 0
                ? Math.round((payments.filter(p => p.status === "paid").length / payments.length) * 100)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Collection</CardTitle>
          <CardDescription>Track and manage student fee payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.student_name}</TableCell>
                  <TableCell>{payment.batch_name}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(payment.due_date).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Collection Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Collect Fee Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Student</Label>
              <Input value={selectedStudent?.name || ""} disabled />
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label>Payment Mode</Label>
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
            <Button onClick={handlePaymentSubmit}>Collect Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 