import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'

export async function GET(request: NextRequest) {
  try {
    console.log('Callback called with URL:', request.url)
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    console.log('Token:', token)
    console.log('Email:', email)

    if (!token || !email) {
      console.log('Missing token or email')
      return NextResponse.redirect(new URL('/auth/signin?error=InvalidToken', 'http://localhost:3001'))
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verify the token
    const { data: verificationToken, error: tokenError } = await supabase
      .from('verificationTokens')
      .select('*')
      .eq('identifier', email)
      .eq('token', token)
      .single()

    if (tokenError || !verificationToken) {
      return NextResponse.redirect(new URL('/auth/signin?error=InvalidToken', 'http://localhost:3001'))
    }

    // Check if token is expired
    if (new Date(verificationToken.expires) < new Date()) {
      return NextResponse.redirect(new URL('/auth/signin?error=TokenExpired', 'http://localhost:3001'))
    }

    // Get the user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.redirect(new URL('/auth/signin?error=UserNotFound', 'http://localhost:3001'))
    }

    // Create a session
    const sessionToken = randomBytes(32).toString('hex')
    const sessionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({
        id: sessionToken,
        sessionToken: sessionToken,
        userId: user.id,
        expires: sessionExpires.toISOString()
      })

    if (sessionError) {
      console.error('Session creation error:', sessionError)
      return NextResponse.redirect(new URL('/auth/signin?error=SessionError', 'http://localhost:3001'))
    }

    // Delete the verification token
    await supabase
      .from('verificationTokens')
      .delete()
      .eq('identifier', email)
      .eq('token', token)

    // Set the session cookie
    const cookieStore = await cookies()
    cookieStore.set('next-auth.session-token', sessionToken, {
      expires: sessionExpires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    // Redirect to the app
    return NextResponse.redirect(new URL('/welcome', 'http://localhost:3001'))
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/auth/signin?error=CallbackError', 'http://localhost:3001'))
  }
}
