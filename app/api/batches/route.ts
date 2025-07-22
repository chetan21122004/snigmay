import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const centerId = searchParams.get('center')

    let query = supabase
      .from('batches')
      .select(`
        id,
        name,
        description,
        center_id,
        coach_id,
        centers(id, name, location),
        users(id, full_name)
      `)
      .order('name')

    // Filter by center if specified
    if (centerId && centerId !== '') {
      query = query.eq('center_id', centerId)
    }

    const { data: batchesData, error } = await query

    if (error) {
      throw new Error(`Failed to fetch batches: ${error.message}`)
    }

    // Transform data for frontend
    const transformedData = (batchesData || []).map((batch: any) => ({
      id: batch.id,
      name: batch.name,
      description: batch.description,
      center_id: batch.center_id,
      center_name: batch.centers?.location || 'Unknown Center',
      coach_id: batch.coach_id,
      coach_name: batch.users?.full_name || 'No Coach Assigned'
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching batches:', error)
    return NextResponse.json({ error: 'Failed to fetch batches data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received batch data:', body)
    
    const { name, description, coach_id, center_id } = body

    if (!name || !center_id) {
      console.error('Missing required fields:', { name, center_id })
      return NextResponse.json({ error: 'Name and center are required' }, { status: 400 })
    }

    // Prepare the batch data
    const batchData = {
      name: name.trim(),
      description: description?.trim() || null,
      coach_id: coach_id || null,
      center_id: center_id
    }

    console.log('Inserting batch data:', batchData)

    // Use Supabase client for better error handling
    const { data, error } = await supabase
      .from('batches')
      .insert(batchData)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        details: error.details,
        hint: error.hint
      }, { status: 500 })
    }

    console.log('Batch created successfully:', data)
    return NextResponse.json(data[0])
  } catch (error: any) {
    console.error('Error creating batch:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create batch',
      stack: error.stack 
    }, { status: 500 })
  }
} 