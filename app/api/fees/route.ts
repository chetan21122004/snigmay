import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const center = searchParams.get("center") || "all"

    // Build query - updated to work with new database structure
    let query = supabase
      .from("fee_payments")
      .select(`
        *,
        students!inner(
          id,
          name,
          batches!inner(
            id,
            name,
            centers!inner(
              id,
              name,
              location
            )
          )
        )
      `)

    // Filter by center if not "all"
    if (center !== "all") {
      query = query.eq("students.batches.centers.id", center)
    }

    const { data, error } = await query.order("due_date", { ascending: false })

    if (error) {
      console.error("Error fetching fee payments:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform data for frontend
    const transformedData = data?.map(payment => ({
      id: payment.id,
      student_id: payment.student_id,
      student_name: payment.students?.name || "Unknown",
      batch_name: payment.students?.batches?.name || "Unknown",
      center_name: payment.students?.batches?.centers?.name || "Unknown",
      center_location: payment.students?.batches?.centers?.location || "Unknown",
      amount: payment.amount,
      payment_date: payment.payment_date,
      payment_mode: payment.payment_mode,
      receipt_number: payment.receipt_number,
      status: payment.status,
      due_date: payment.due_date
    })) || []

    return NextResponse.json(transformedData)
  } catch (error: any) {
    console.error("Error in fees API:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { student_id, amount, payment_mode, receipt_number, status, due_date } = body

    // Validate required fields
    if (!student_id || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: student_id, amount" },
        { status: 400 }
      )
    }

    // Create the fee payment record
    const paymentData = {
      student_id,
      amount: parseFloat(amount),
      payment_date: new Date().toISOString().split('T')[0],
      payment_mode: payment_mode || 'cash',
      receipt_number: receipt_number || null,
      status: status || 'due',
      due_date: due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
        { error: "Failed to create payment: " + paymentError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Payment created successfully",
      payment
    })

  } catch (error: any) {
    console.error("Error in fees API POST:", error)
    return NextResponse.json(
      { error: "Internal server error: " + error.message },
      { status: 500 }
    )
  }
} 