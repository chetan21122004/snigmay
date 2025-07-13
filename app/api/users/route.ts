import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    }

    // Build users query
    let usersQuery = `${supabaseUrl}/rest/v1/users?select=id,full_name,email,role,center_id,centers(id,name,location)&order=full_name`

    // Filter by role if specified
    if (role) {
      usersQuery += `&role=eq.${role}`
    }

    const usersRes = await fetch(usersQuery, { headers })
    
    if (!usersRes.ok) {
      throw new Error('Failed to fetch users data')
    }

    const usersData = await usersRes.json()

    // Transform data for frontend
    const transformedData = usersData.map((user: any) => ({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      center_id: user.center_id,
      center_name: user.centers?.location || 'No Center Assigned'
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users data' }, { status: 500 })
  }
} 