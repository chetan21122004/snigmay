import { NextRequest, NextResponse } from 'next/server'

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
    let studentsQuery = `${supabaseUrl}/rest/v1/students?select=id,name,age,contact_info,batch_id,batches(id,name,center_id,centers(id,name,location))&order=name`

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
      center_name: student.batches?.centers?.location || 'Unknown Center'
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: 'Failed to fetch students data' }, { status: 500 })
  }
} 