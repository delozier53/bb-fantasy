import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic Supabase connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      return NextResponse.json({ 
        error: 'Supabase connection failed', 
        details: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection working',
      data 
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Supabase test failed', 
      details: error.message 
    }, { status: 500 })
  }
}
