import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const center = searchParams.get("center") || "all"

    // Build query
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
            center_id
          )
        )
      `)

    // Filter by center if not "all"
    if (center !== "all") {
      query = query.eq("students.batches.center_id", center)
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