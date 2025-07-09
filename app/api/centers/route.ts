import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch centers from Supabase
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/centers?select=*&order=location`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch centers from database')
    }

    const centers = await response.json()
    
    return NextResponse.json(centers)
  } catch (error) {
    console.error('Error fetching centers:', error)
    return NextResponse.json({ error: 'Failed to fetch centers' }, { status: 500 })
  }
} 