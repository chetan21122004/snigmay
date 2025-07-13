import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    console.log('Updating student:', id, body)
    
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

    console.log('Updating student data:', studentData)

    // Use Supabase client for better error handling
    const { data, error } = await supabase
      .from('students')
      .update(studentData)
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

    console.log('Student updated successfully:', data)
    return NextResponse.json(data[0])
  } catch (error: any) {
    console.error('Error updating student:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to update student',
      stack: error.stack 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log('Deleting student:', id)

    // Use Supabase client for better error handling
    const { error } = await supabase
      .from('students')
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

    console.log('Student deleted successfully')
    return NextResponse.json({ message: 'Student deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting student:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to delete student',
      stack: error.stack 
    }, { status: 500 })
  }
} 