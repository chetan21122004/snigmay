import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const centerId = searchParams.get('center')
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const batchId = searchParams.get('batch')

    let query = supabase
      .from('attendance')
      .select(`
        id,
        date,
        status,
        student_id,
        batch_id,
        marked_by,
        created_at,
        students(id, name, center_id),
        batches(id, name, center_id, centers(id, name, location)),
        users(id, full_name)
      `)
      .eq('date', date)

    // Filter by center if specified (using student's center_id)
    if (centerId && centerId !== '') {
      query = query.eq('students.center_id', centerId)
    }

    // Filter by batch if specified
    if (batchId && batchId !== '') {
      query = query.eq('batch_id', batchId)
    }

    const { data: attendanceData, error } = await query

    if (error) {
      throw new Error(`Failed to fetch attendance: ${error.message}`)
    }

    // Transform data for frontend
    const transformedData = (attendanceData || []).map((record: any) => ({
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

    // Check if attendance already exists for this student on this date
    const { data: existingData, error: checkError } = await supabase
      .from('attendance')
      .select('id')
      .eq('student_id', student_id)
      .eq('date', date)

    if (checkError) {
      throw new Error(`Failed to check existing attendance: ${checkError.message}`)
    }

    if (existingData && existingData.length > 0) {
      // Update existing attendance
      const { error: updateError } = await supabase
        .from('attendance')
        .update({
          status,
          marked_by,
          batch_id
        })
        .eq('id', existingData[0].id)

      if (updateError) {
        throw new Error(`Failed to update attendance: ${updateError.message}`)
      }

      return NextResponse.json({ message: 'Attendance updated successfully' })
    } else {
      // Create new attendance record
      const { error: insertError } = await supabase
        .from('attendance')
        .insert({
          student_id,
          batch_id,
          date,
          status,
          marked_by
        })

      if (insertError) {
        throw new Error(`Failed to create attendance: ${insertError.message}`)
      }

      return NextResponse.json({ message: 'Attendance marked successfully' })
    }
  } catch (error) {
    console.error('Error marking attendance:', error)
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 })
  }
} 