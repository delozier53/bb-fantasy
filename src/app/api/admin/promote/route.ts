import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Update the user to be an admin
    const { data, error } = await supabase
      .from('users')
      .update({ isAdmin: true })
      .eq('email', email)
      .select()

    if (error) {
      console.error('Error promoting user to admin:', error)
      return NextResponse.json({ error: 'Failed to promote user' }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'User promoted to admin successfully',
      user: data[0]
    })
  } catch (error) {
    console.error('Error in promote endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
