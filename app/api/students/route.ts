import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const centerId = searchParams.get('center')
    const batchId = searchParams.get('batch')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    }

    // Build students query with batch and center information
    let studentsQuery = `${supabaseUrl}/rest/v1/students?select=id,name,age,contact_info,batch_id,parent_name,parent_phone,parent_email,address,emergency_contact,medical_conditions,batches(id,name,center_id,centers(id,name,location))&order=name`

    // Filter by batch if specified
    if (batchId && batchId !== 'all') {
      studentsQuery += `&batch_id=eq.${batchId}`
    }

    const studentsRes = await fetch(studentsQuery, { headers })
    
    if (!studentsRes.ok) {
      throw new Error('Failed to fetch students data')
    }

    let studentsData = await studentsRes.json()

    // Filter by center if specified and not 'all'
    if (centerId && centerId !== 'all') {
      studentsData = studentsData.filter((student: any) => 
        student.batches && student.batches.center_id === centerId
      )
    }

    // Transform data for frontend
    const transformedData = studentsData.map((student: any) => ({
      id: student.id,
      name: student.name,
      age: student.age,
      contact_info: student.contact_info,
      batch_id: student.batch_id,
      batch_name: student.batches?.name || 'No Batch Assigned',
      center_name: student.batches?.centers?.location || 'Unknown Center',
      parent_name: student.parent_name,
      parent_phone: student.parent_phone,
      parent_email: student.parent_email,
      address: student.address,
      emergency_contact: student.emergency_contact,
      medical_conditions: student.medical_conditions,
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: 'Failed to fetch students data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received student data:', body)
    
    const { 
      name, 
      age, 
      contact_info, 
      batch_id, 
      parent_name, 
      parent_phone, 
      parent_email, 
      address, 
      emergency_contact, 
      medical_conditions 
    } = body

    if (!name || !age) {
      console.error('Missing required fields:', { name, age })
      return NextResponse.json({ error: 'Name and age are required' }, { status: 400 })
    }

    // Prepare the student data
    const studentData = {
      name: name.trim(),
      age: parseInt(age),
      contact_info: contact_info?.trim() || null,
      batch_id: batch_id || null,
      parent_name: parent_name?.trim() || null,
      parent_phone: parent_phone?.trim() || null,
      parent_email: parent_email?.trim() || null,
      address: address?.trim() || null,
      emergency_contact: emergency_contact?.trim() || null,
      medical_conditions: medical_conditions?.trim() || null
    }

    console.log('Inserting student data:', studentData)

    // Use Supabase client for better error handling
    const { data, error } = await supabase
      .from('students')
      .insert(studentData)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        details: error.details,
        hint: error.hint
      }, { status: 500 })
    }

    console.log('Student created successfully:', data)
    return NextResponse.json(data[0])
  } catch (error: any) {
    console.error('Error creating student:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create student',
      stack: error.stack 
    }, { status: 500 })
  }
} 