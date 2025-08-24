'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function PromotePage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePromote = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/admin/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to promote user')
      }

      toast.success('You are now an admin! You can now access /admin')
      setEmail('')
    } catch (error) {
      console.error('Error promoting user:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to promote user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Promote to Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
          </div>
          <Button 
            onClick={handlePromote} 
            disabled={loading} 
            className="w-full"
          >
            {loading ? 'Promoting...' : 'Make Me Admin'}
          </Button>
          <p className="text-sm text-gray-600 text-center">
            After promotion, you can access the admin panel at /admin
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
