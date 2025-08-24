import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Test direct email sending with the same configuration as NextAuth
    try {
      const nodemailer = require('nodemailer')
      
      const transporter = nodemailer.createTransporter({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      })

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Test Email from Big Brother Fantasy League',
        text: 'This is a test email to verify the email configuration is working.',
      }

      await transporter.sendMail(mailOptions)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email sent successfully using NextAuth provider'
      })
    } catch (error) {
      return NextResponse.json({ 
        error: 'Email provider failed', 
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 })
    }
  } catch (error) {
    console.error('NextAuth email test error:', error)
    return NextResponse.json({ 
      error: 'NextAuth email test failed', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
