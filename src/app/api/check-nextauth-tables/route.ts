import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if NextAuth tables exist
    const tables = [
      'users',
      'accounts', 
      'sessions',
      'verification_tokens'
    ]

    const results = {}
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          results[table] = { exists: false, error: error.message }
        } else {
          results[table] = { exists: true, count: data?.length || 0 }
        }
      } catch (err) {
        results[table] = { exists: false, error: err.message }
      }
    }

    return NextResponse.json({
      success: true,
      tables: results
    })
  } catch (error) {
    console.error('Check tables error:', error)
    return NextResponse.json({ 
      error: 'Failed to check tables', 
      details: error.message 
    }, { status: 500 })
  }
}
