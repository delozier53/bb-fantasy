import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      success: true,
      message: 'Simple test endpoint working',
      receivedData: body
    })
  } catch (error) {
    console.error('Simple test error:', error)
    return NextResponse.json({ 
      error: 'Simple test failed', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
