import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    hasSendGridKey: !!process.env.SENDGRID_API_KEY,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasEmailFrom: !!process.env.EMAIL_FROM,
    sendGridKeyLength: process.env.SENDGRID_API_KEY?.length || 0,
    nextAuthSecretLength: process.env.NEXTAUTH_SECRET?.length || 0,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    emailFrom: process.env.EMAIL_FROM,
  }

  return NextResponse.json(envCheck)
}
