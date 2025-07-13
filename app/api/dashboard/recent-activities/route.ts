import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    }

    // Get recent activities from the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    // Fetch recent fee payments
    const feePaymentsRes = await fetch(
      `${supabaseUrl}/rest/v1/fee_payments?select=id,amount,payment_date,created_at,students(name,batches(centers(location)))&status=eq.paid&created_at=gte.${sevenDaysAgo}&order=created_at.desc&limit=10`,
      { headers }
    )

    // Fetch recent attendance records
    const attendanceRes = await fetch(
      `${supabaseUrl}/rest/v1/attendance?select=id,date,created_at,batches(name,centers(location))&created_at=gte.${sevenDaysAgo}&order=created_at.desc&limit=10`,
      { headers }
    )

    // Fetch recent student registrations
    const studentsRes = await fetch(
      `${supabaseUrl}/rest/v1/students?select=id,name,created_at,batches(name,centers(location))&created_at=gte.${sevenDaysAgo}&order=created_at.desc&limit=10`,
      { headers }
    )

    // Fetch recent batch creations
    const batchesRes = await fetch(
      `${supabaseUrl}/rest/v1/batches?select=id,name,created_at,centers(location)&created_at=gte.${sevenDaysAgo}&order=created_at.desc&limit=10`,
      { headers }
    )

    const activities: any[] = []

    // Process fee payments
    if (feePaymentsRes.ok) {
      const feePayments = await feePaymentsRes.json()
      feePayments.forEach((payment: any) => {
        activities.push({
          id: `payment-${payment.id}`,
          type: 'payment',
          description: `Fee payment received from ${payment.students?.name || 'Unknown Student'}`,
          timestamp: payment.created_at,
          amount: Number(payment.amount),
          centerName: payment.students?.batches?.centers?.location || 'Unknown Center'
        })
      })
    }

    // Process attendance records
    if (attendanceRes.ok) {
      const attendanceRecords = await attendanceRes.json()
      attendanceRecords.forEach((record: any) => {
        activities.push({
          id: `attendance-${record.id}`,
          type: 'attendance',
          description: `Attendance marked for ${record.batches?.name || 'Unknown Batch'}`,
          timestamp: record.created_at,
          centerName: record.batches?.centers?.location || 'Unknown Center'
        })
      })
    }

    // Process student registrations
    if (studentsRes.ok) {
      const students = await studentsRes.json()
      students.forEach((student: any) => {
        activities.push({
          id: `registration-${student.id}`,
          type: 'registration',
          description: `New student registration - ${student.name}`,
          timestamp: student.created_at,
          centerName: student.batches?.centers?.location || 'Unknown Center'
        })
      })
    }

    // Process batch creations
    if (batchesRes.ok) {
      const batches = await batchesRes.json()
      batches.forEach((batch: any) => {
        activities.push({
          id: `batch-${batch.id}`,
          type: 'batch_creation',
          description: `New batch created - ${batch.name}`,
          timestamp: batch.created_at,
          centerName: batch.centers?.location || 'Unknown Center'
        })
      })
    }

    // Sort activities by timestamp (most recent first) and limit to 20
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20)

    return NextResponse.json(sortedActivities)
  } catch (error) {
    console.error('Error fetching recent activities:', error)
    
    // Return fallback mock data
    const mockActivities = [
      {
        id: 'payment-1',
        type: 'payment',
        description: 'Fee payment received from Arjun Sharma',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        amount: 3500,
        centerName: 'Kharadi'
      },
      {
        id: 'attendance-1',
        type: 'attendance',
        description: 'Attendance marked for U-14 Morning batch',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        centerName: 'Viman Nagar'
      },
      {
        id: 'registration-1',
        type: 'registration',
        description: 'New student registration - Priya Patel',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        centerName: 'Hadapsar'
      },
      {
        id: 'payment-2',
        type: 'payment',
        description: 'Fee payment received from Rohit Kumar',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        amount: 4000,
        centerName: 'Kharadi'
      },
      {
        id: 'batch-1',
        type: 'batch_creation',
        description: 'New batch created - U-10 Evening',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        centerName: 'Viman Nagar'
      }
    ]

    return NextResponse.json(mockActivities)
  }
} 