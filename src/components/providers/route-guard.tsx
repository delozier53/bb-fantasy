'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface UserData {
  username?: string
  picks?: string[]
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch('/api/me')
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
        } else {
          // User not authenticated, allow access to welcome page
          setUserData(null)
        }
      } catch (error) {
        console.error('Error checking user status:', error)
        setUserData(null)
      } finally {
        setLoading(false)
      }
    }

    checkUserStatus()
  }, [])

  useEffect(() => {
    if (loading) return

    // Determine if user has completed their profile
    const hasCompletedProfile = userData?.username && userData?.picks && userData.picks.length === 5

    // Public routes that don't require profile completion
    const publicRoutes = ['/', '/welcome', '/auth/signin', '/auth/verify-request']
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!hasCompletedProfile && !isPublicRoute) {
      // User hasn't completed profile and is trying to access a protected route
      router.push('/welcome')
    } else if (hasCompletedProfile && pathname === '/welcome') {
      // User has completed profile but is on welcome page, redirect to home
      router.push('/houseguests')
    }
  }, [userData, loading, pathname, router])

  // Show loading state while checking user status
  if (loading) {
    return (
      <div className="min-h-screen navy-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
