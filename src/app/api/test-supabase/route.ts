import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    // Test basic connection
    const { data, error } = await supabase
      .from('houseguests')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        error: 'Supabase connection failed', 
        details: error.message,
        code: error.code 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection working',
      data: data 
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
