import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    // Test if we can access the authOptions
    const providers = authOptions.providers
    const adapter = authOptions.adapter
    
    return NextResponse.json({
      success: true,
      providers: providers.map(p => ({ id: p.id, name: p.name })),
      hasAdapter: !!adapter,
      hasEmailProvider: providers.some(p => p.id === 'email')
    })
  } catch (error) {
    console.error('Basic NextAuth test error:', error)
    return NextResponse.json({ 
      error: 'Basic NextAuth test failed', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
