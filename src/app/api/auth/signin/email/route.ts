import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user exists, create if not
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      console.error('User lookup error:', userError)
      return NextResponse.json({ error: 'Failed to check user' }, { status: 500 })
    }

    // Create user if doesn't exist
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: email,
          username: email.split('@')[0], // Use email prefix as username
          isAdmin: false
        })
        .select()
        .single()

      if (createError) {
        console.error('User creation error:', createError)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }
      user = newUser
    }

    // Generate a verification token
    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store the verification token in the database
    const { error: tokenError } = await supabase
      .from('verificationTokens')
      .insert({
        identifier: email,
        token: token,
        expires: expires.toISOString()
      })

    if (tokenError) {
      console.error('Token storage error:', tokenError)
      return NextResponse.json({ error: 'Failed to create verification token' }, { status: 500 })
    }

    // Send the email using fetch to SendGrid API directly
    try {
      const signinUrl = `http://localhost:3001/api/auth/callback/email?token=${token}&email=${encodeURIComponent(email)}`
      
      const emailData = {
        personalizations: [
          {
            to: [{ email: email }]
          }
        ],
        from: { email: process.env.EMAIL_FROM },
        subject: 'Sign in to BB Fantasy League',
        content: [
          {
            type: 'text/plain',
            value: `Click the link below to sign in:\n\n${signinUrl}\n\nIf you didn't request this email, you can safely ignore it.`
          },
          {
            type: 'text/html',
            value: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e3a8a;">BB Fantasy League</h2>
                <p>Click the button below to sign in:</p>
                <a href="${signinUrl}" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Sign In</a>
                <p style="color: #666; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
              </div>
            `
          }
        ]
      }

      const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      })

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text()
        console.error('SendGrid API error:', errorText)
        throw new Error(`SendGrid API error: ${emailResponse.status}`)
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Check your email for a sign-in link!' 
      })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
  } catch (error) {
    console.error('Signin error:', error)
    return NextResponse.json({ 
      error: 'Signin failed', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
