'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen navy-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            A sign in link has been sent to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-600">
            <p>If you don't see it, check your spam folder.</p>
            <p className="mt-2">
              The link will expire in 24 hours and can only be used once.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link href="/welcome">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
