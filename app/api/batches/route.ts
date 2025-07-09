import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const centerId = searchParams.get('center')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    }

    // Build batches query with center information
    let batchesQuery = `${supabaseUrl}/rest/v1/batches?select=id,name,description,center_id,centers(id,name,location),users(id,full_name)&order=name`

    // Filter by center if specified
    if (centerId && centerId !== 'all') {
      batchesQuery += `&center_id=eq.${centerId}`
    }

    const batchesRes = await fetch(batchesQuery, { headers })
    
    if (!batchesRes.ok) {
      throw new Error('Failed to fetch batches data')
    }

    const batchesData = await batchesRes.json()

    // Transform data for frontend
    const transformedData = batchesData.map((batch: any) => ({
      id: batch.id,
      name: batch.name,
      description: batch.description,
      center_id: batch.center_id,
      center_name: batch.centers?.location || 'Unknown Center',
      coach_name: batch.users?.full_name || 'No Coach Assigned'
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching batches:', error)
    return NextResponse.json({ error: 'Failed to fetch batches data' }, { status: 500 })
  }
} 