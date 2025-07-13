import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, hashPassword } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    console.log('Updating user:', id, body)
    
    // Check if current user is authorized (super admin)
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { full_name, email, role, center_id, password } = body

    if (!full_name || !email || !role) {
      console.error('Missing required fields:', { full_name, email, role })
      return NextResponse.json({ error: 'Full name, email, and role are required' }, { status: 400 })
    }

    // Prepare the user data
    const userData: any = {
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      role: role,
      center_id: center_id || null
    }

    // Hash password if provided
    if (password && password.trim()) {
      userData.password_hash = await hashPassword(password.trim())
    }

    console.log('Updating user data:', userData)

    // Use Supabase client for better error handling
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        details: error.details,
        hint: error.hint
      }, { status: 500 })
    }

    if (data.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('User updated successfully:', data)
    return NextResponse.json(data[0])
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to update user',
      stack: error.stack 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log('Deleting user:', id)

    // Check if current user is authorized (super admin)
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Don't allow deletion of the current user
    if (currentUser.id === id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    // First, unassign user from all batches if they are a coach
    const { error: batchError } = await supabase
      .from('batches')
      .update({ coach_id: null })
      .eq('coach_id', id)

    if (batchError) {
      console.error('Error unassigning user from batches:', batchError)
      // Continue with deletion even if batch update fails
    }

    // Use Supabase client for better error handling
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: `Database error: ${error.message}`,
        details: error.details,
        hint: error.hint
      }, { status: 500 })
    }

    console.log('User deleted successfully')
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to delete user',
      stack: error.stack 
    }, { status: 500 })
  }
} 