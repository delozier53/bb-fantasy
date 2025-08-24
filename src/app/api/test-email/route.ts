import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Use require to avoid Turbopack import issues
    const nodemailer = require('nodemailer')
    
    // Create transporter using SendGrid configuration
    const transporter = nodemailer.createTransporter({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    })

    // Test email configuration
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Test Email from BB Fantasy',
      text: 'This is a test email to verify the email configuration is working.',
    }

    const info = await transporter.sendMail(mailOptions)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      messageId: info.messageId
    })
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({ 
      error: 'Email test failed', 
      details: error.message 
    }, { status: 500 })
  }
}
