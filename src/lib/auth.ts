import { NextAuthOptions } from 'next-auth'
import { SupabaseAdapter } from '@next-auth/supabase-adapter'
import EmailProvider from 'next-auth/providers/email'

// Custom email provider to avoid the brandColor issue
const CustomEmailProvider = {
  id: 'email',
  type: 'email',
  name: 'Email',
  server: {
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY!,
    },
  },
  from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
  sendVerificationRequest: async ({ identifier, url }: { identifier: string; url: string }) => {
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
      to: identifier,
      subject: 'Sign in to Big Brother Fantasy League',
      text: `Click the link below to sign in:\n\n${url}\n\nIf you didn't request this email, you can safely ignore it.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">Big Brother Fantasy League</h2>
          <p>Click the button below to sign in:</p>
          <a href="${url}" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Sign In</a>
          <p style="color: #666; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
  }
}

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  // Set the correct URL for the current port
  url: 'http://localhost:3001',
  providers: [
    CustomEmailProvider as any,
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user && user) {
        session.user.id = user.id
        session.user.isAdmin = user.isAdmin
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
  debug: true,
}
