import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test if we can access the NextAuth API route
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/providers`)
    
    if (!response.ok) {
      return NextResponse.json({
        error: 'NextAuth API not responding',
        status: response.status,
        statusText: response.statusText
      }, { status: 500 })
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      providers: data,
      message: 'NextAuth API is working'
    })
  } catch (error) {
    console.error('NextAuth API test error:', error)
    return NextResponse.json({ 
      error: 'NextAuth API test failed', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
