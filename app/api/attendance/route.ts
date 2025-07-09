import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const centerId = searchParams.get('center')
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const batchId = searchParams.get('batch')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    }

    // Build attendance query with joins
    let attendanceQuery = `${supabaseUrl}/rest/v1/attendance?select=id,date,status,student_id,batch_id,marked_by,created_at,students(id,name),batches(id,name,center_id,centers(id,name,location)),users(id,full_name)&date=eq.${date}`

    // Filter by batch if specified
    if (batchId && batchId !== 'all') {
      attendanceQuery += `&batch_id=eq.${batchId}`
    }

    const attendanceRes = await fetch(attendanceQuery, { headers })
    
    if (!attendanceRes.ok) {
      throw new Error('Failed to fetch attendance data')
    }

    let attendanceData = await attendanceRes.json()

    // Filter by center if specified and not 'all'
    if (centerId && centerId !== 'all') {
      attendanceData = attendanceData.filter((record: any) => 
        record.batches && record.batches.center_id === centerId
      )
    }

    // Transform data for frontend
    const transformedData = attendanceData.map((record: any) => ({
      id: record.id,
      student_name: record.students?.name || 'Unknown Student',
      batch_name: record.batches?.name || 'Unknown Batch',
      center_name: record.batches?.centers?.location || 'Unknown Center',
      date: record.date,
      status: record.status,
      marked_by: record.users?.full_name || 'System'
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json({ error: 'Failed to fetch attendance data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { student_id, batch_id, date, status, marked_by } = body

    if (!student_id || !batch_id || !date || !status || !marked_by) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    }

    // Check if attendance already exists for this student on this date
    const existingQuery = `${supabaseUrl}/rest/v1/attendance?select=id&student_id=eq.${student_id}&date=eq.${date}`
    const existingRes = await fetch(existingQuery, { headers })
    const existingData = await existingRes.json()

    if (existingData.length > 0) {
      // Update existing attendance
      const updateRes = await fetch(`${supabaseUrl}/rest/v1/attendance?id=eq.${existingData[0].id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          status,
          marked_by,
          batch_id
        })
      })

      if (!updateRes.ok) {
        throw new Error('Failed to update attendance')
      }

      return NextResponse.json({ message: 'Attendance updated successfully' })
    } else {
      // Create new attendance record
      const insertRes = await fetch(`${supabaseUrl}/rest/v1/attendance`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          student_id,
          batch_id,
          date,
          status,
          marked_by
        })
      })

      if (!insertRes.ok) {
        throw new Error('Failed to create attendance record')
      }

      return NextResponse.json({ message: 'Attendance marked successfully' })
    }
  } catch (error) {
    console.error('Error marking attendance:', error)
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 })
  }
} 