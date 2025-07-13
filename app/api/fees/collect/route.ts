import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { student_id, amount, payment_mode, receipt_number } = body

    // Validate required fields
    if (!student_id || !amount || !payment_mode) {
      return NextResponse.json(
        { error: "Missing required fields: student_id, amount, payment_mode" },
        { status: 400 }
      )
    }

    // Validate amount is positive
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      )
    }

    // Validate payment mode
    const validPaymentModes = ['cash', 'upi', 'bank_transfer', 'check']
    if (!validPaymentModes.includes(payment_mode)) {
      return NextResponse.json(
        { error: "Invalid payment mode" },
        { status: 400 }
      )
    }

    // Check if student exists
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id, name')
      .eq('id', student_id)
      .single()

    if (studentError || !student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    // Create the fee payment record
    const paymentData = {
      student_id,
      amount: parseFloat(amount),
      payment_date: new Date().toISOString().split('T')[0],
      payment_mode,
      receipt_number: receipt_number || `RCP-${Date.now()}`,
      status: 'paid',
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      created_by: '11111111-1111-1111-1111-111111111111' // Default admin user for now
    }

    const { data: payment, error: paymentError } = await supabase
      .from('fee_payments')
      .insert([paymentData])
      .select()
      .single()

    if (paymentError) {
      console.error("Error creating payment:", paymentError)
      return NextResponse.json(
        { error: "Failed to record payment: " + paymentError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Payment recorded successfully",
      payment: {
        id: payment.id,
        student_name: student.name,
        amount: payment.amount,
        payment_date: payment.payment_date,
        payment_mode: payment.payment_mode,
        receipt_number: payment.receipt_number,
        status: payment.status
      }
    })

  } catch (error: any) {
    console.error("Error in fee collection API:", error)
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    )
  }
} 