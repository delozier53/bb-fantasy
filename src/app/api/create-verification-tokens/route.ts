import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create the verification_tokens table
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "verificationTokens" (
          identifier TEXT NOT NULL,
          token TEXT UNIQUE NOT NULL,
          expires TIMESTAMP WITH TIME ZONE NOT NULL,
          UNIQUE(identifier, token)
        );
        
        ALTER TABLE "verificationTokens" ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Verification tokens are accessible by user" ON "verificationTokens"
          FOR ALL USING (true);
      `
    })

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to create verification_tokens table', 
        details: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'verification_tokens table created successfully'
    })
  } catch (error) {
    console.error('Create table error:', error)
    return NextResponse.json({ 
      error: 'Failed to create table', 
      details: error.message 
    }, { status: 500 })
  }
}
