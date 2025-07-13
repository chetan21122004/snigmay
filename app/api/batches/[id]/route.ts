import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    console.log('Updating batch:', id, body)
    
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

    console.log('Updating batch data:', batchData)

    // Use Supabase client for better error handling
    const { data, error } = await supabase
      .from('batches')
      .update(batchData)
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

    console.log('Batch updated successfully:', data)
    return NextResponse.json(data[0])
  } catch (error: any) {
    console.error('Error updating batch:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to update batch',
      stack: error.stack 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log('Deleting batch:', id)

    // Use Supabase client for better error handling
    const { error } = await supabase
      .from('batches')
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

    console.log('Batch deleted successfully')
    return NextResponse.json({ message: 'Batch deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting batch:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to delete batch',
      stack: error.stack 
    }, { status: 500 })
  }
} 