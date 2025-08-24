import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Try to access the verificationTokens table directly
    let verificationTokensExists = false
    let verificationTokensError = null
    
    try {
      const { data, error } = await supabase
        .from('verificationTokens')
        .select('*')
        .limit(1)
      
      if (!error) {
        verificationTokensExists = true
      } else {
        verificationTokensError = error.message
      }
    } catch (err) {
      verificationTokensError = err instanceof Error ? err.message : String(err)
    }

    // Try alternative table names
    let verificationTokensAltExists = false
    let verificationTokensAltError = null
    
    try {
      const { data, error } = await supabase
        .from('verification_tokens')
        .select('*')
        .limit(1)
      
      if (!error) {
        verificationTokensAltExists = true
      } else {
        verificationTokensAltError = error.message
      }
    } catch (err) {
      verificationTokensAltError = err instanceof Error ? err.message : String(err)
    }

    return NextResponse.json({
      success: true,
      verificationTokens: {
        exists: verificationTokensExists,
        error: verificationTokensError
      },
      verificationTokensAlt: {
        exists: verificationTokensAltExists,
        error: verificationTokensAltError
      }
    })
  } catch (error) {
    console.error('Check tables detail error:', error)
    return NextResponse.json({ 
      error: 'Failed to check tables', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
