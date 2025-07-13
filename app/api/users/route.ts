import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, hashPassword } from '@/lib/auth'

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Creating user:', body)
    
    // Check if current user is authorized (super admin)
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { full_name, email, password, role, center_id } = body

    if (!full_name || !email || !password || !role) {
      console.error('Missing required fields:', { full_name, email, password, role })
      return NextResponse.json({ error: 'Full name, email, password, and role are required' }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(password.trim())

    // Prepare the user data
    const userData = {
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      password_hash: passwordHash,
      role: role,
      center_id: center_id || null
    }

    console.log('Inserting user data:', { ...userData, password_hash: '[HIDDEN]' })

    // Use Supabase client for better error handling
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        details: error.details,
        hint: error.hint
      }, { status: 500 })
    }

    console.log('User created successfully:', data)
    return NextResponse.json(data[0])
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create user',
      stack: error.stack 
    }, { status: 500 })
  }
} 