import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('next-auth.session-token')?.value

    if (!sessionToken) {
      return NextResponse.json({ user: null })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get the session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('sessionToken', sessionToken)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ user: null })
    }

    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      return NextResponse.json({ user: null })
    }

    // Get the user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        photoUrl: user.photoUrl
      }
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ user: null })
  }
}
