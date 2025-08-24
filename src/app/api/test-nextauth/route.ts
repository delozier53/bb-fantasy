import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Test the email provider configuration
    const emailProvider = authOptions.providers.find(p => p.id === 'email')
    
    if (!emailProvider) {
      return NextResponse.json({ error: 'Email provider not found' }, { status: 500 })
    }

    // Test the email provider's sendVerificationRequest function
    if (emailProvider.sendVerificationRequest) {
      try {
        await emailProvider.sendVerificationRequest({
          identifier: email,
          url: `http://localhost:3000/api/auth/callback/email?token=test&email=${email}`,
          provider: emailProvider,
        })
        
        return NextResponse.json({ 
          success: true, 
          message: 'Email provider test successful'
        })
      } catch (error) {
        return NextResponse.json({ 
          error: 'Email provider test failed', 
          details: error.message 
        }, { status: 500 })
      }
    } else {
      return NextResponse.json({ 
        error: 'Email provider sendVerificationRequest not available' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('NextAuth test error:', error)
    return NextResponse.json({ 
      error: 'NextAuth test failed', 
      details: error.message 
    }, { status: 500 })
  }
}
