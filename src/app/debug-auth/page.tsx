'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugAuthPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testSignIn = async () => {
    if (!email) return
    
    setLoading(true)
    setResult(null)
    
    try {
      console.log('Attempting sign in with email:', email)
      
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/welcome'
      })
      
      console.log('Sign in result:', result)
      setResult(result)
      
    } catch (error) {
      console.error('Sign in error:', error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const checkEnv = async () => {
    try {
      const response = await fetch('/api/test-auth')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    }
  }

  const testEmail = async () => {
    if (!email) return
    
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testSignInDetailed = async () => {
    if (!email) return
    
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/test-signin-detailed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testNextAuthEmail = async () => {
    if (!email) return
    
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/test-nextauth-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen navy-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Auth Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email for testing
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={testSignIn}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Sign In
            </button>
            
            <button
              onClick={checkEnv}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Check Environment Variables
            </button>
            
            <button
              onClick={testEmail}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Test Email Directly
            </button>
            
            <button
              onClick={testSignInDetailed}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              Test Sign In Detailed
            </button>
            
            <button
              onClick={testNextAuthEmail}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Test NextAuth Email
            </button>
          </div>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-bold mb-2">Result:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
