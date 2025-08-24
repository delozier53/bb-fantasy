import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Test the NextAuth signin endpoint directly
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signin/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        callbackUrl: 'http://localhost:3000/welcome'
      })
    })

    const responseText = await response.text()
    
    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText,
      isJson: isJsonString(responseText)
    })
  } catch (error) {
    console.error('Detailed signin test error:', error)
    return NextResponse.json({ 
      error: 'Detailed signin test failed', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

function isJsonString(str: string) {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}
