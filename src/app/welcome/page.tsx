'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Houseguest } from '@/types'

const userProfileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be at most 20 characters'),
  photoUrl: z.string().url().optional().or(z.literal('')),
})

type UserProfileForm = z.infer<typeof userProfileSchema>

export default function WelcomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedHouseguests, setSelectedHouseguests] = useState<string[]>([])
  const [houseguests, setHouseguests] = useState<Houseguest[]>([])
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileForm>({
    resolver: zodResolver(userProfileSchema),
  })

  // Fetch houseguests when component mounts
  useEffect(() => {
    const fetchHouseguests = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/houseguests')
        if (!response.ok) throw new Error('Failed to fetch houseguests')
        const data = await response.json()
        setHouseguests(data)
      } catch (error) {
        console.error('Error fetching houseguests:', error)
        toast.error('Failed to load houseguests')
      } finally {
        setLoading(false)
      }
    }

    fetchHouseguests()
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            {/* App Logo */}
            <div className="flex justify-center mb-4">
              <img 
                src="/logo.svg" 
                alt="Big Brother Fantasy League Logo" 
                className="w-16 h-16"
              />
            </div>
            <CardTitle>Welcome to Big Brother Fantasy</CardTitle>
            <CardDescription>
              Sign in with your email to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => signIn('email')} 
              className="w-full"
              size="lg"
            >
              Sign In with Email
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const onProfileSubmit = async (data: UserProfileForm) => {
    try {
      const response = await fetch('/api/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          photoUrl: data.photoUrl || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create profile')
      }

      setStep(2)
      toast.success('Profile created successfully!')
    } catch {
      toast.error('Failed to create profile. Please try again.')
    }
  }

  const toggleHouseguest = (id: string) => {
    setSelectedHouseguests(prev => {
      if (prev.includes(id)) {
        return prev.filter(hgId => hgId !== id)
      }
      if (prev.length >= 5) {
        toast.error('You can only select 5 houseguests')
        return prev
      }
      return [...prev, id]
    })
  }

  const onPicksSubmit = async () => {
    if (selectedHouseguests.length !== 5) {
      toast.error('Please select exactly 5 houseguests')
      return
    }

    try {
      const response = await fetch('/api/me/picks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          picks: selectedHouseguests,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save picks')
      }

      toast.success('Your picks have been saved!')
      router.push('/leaderboard')
    } catch {
      toast.error('Failed to save picks. Please try again.')
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            {/* App Logo */}
            <div className="flex justify-center mb-4">
              <img 
                src="/logo.svg" 
                alt="Big Brother Fantasy League Logo" 
                className="w-16 h-16"
              />
            </div>
            <CardTitle>Create Your Profile</CardTitle>
            <CardDescription>
              Step 1 of 2: Tell us about yourself
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register('username')}
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="photoUrl">Profile Photo URL (optional)</Label>
                <Input
                  id="photoUrl"
                  {...register('photoUrl')}
                  placeholder="https://example.com/photo.jpg"
                />
                {errors.photoUrl && (
                  <p className="text-sm text-red-600 mt-1">{errors.photoUrl.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Profile...' : 'Continue to Pick Houseguests'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            {/* App Logo */}
            <div className="flex justify-center mb-4">
              <img 
                src="/logo.svg" 
                alt="Big Brother Fantasy League Logo" 
                className="w-16 h-16"
              />
            </div>
            <CardTitle>Pick Your Team</CardTitle>
            <CardDescription>
              Step 2 of 2: Select exactly 5 houseguests ({selectedHouseguests.length}/5 selected)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading houseguests...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {houseguests.map((hg) => {
                const isSelected = selectedHouseguests.includes(hg.id)
                return (
                  <div
                    key={hg.id}
                    onClick={() => toggleHouseguest(hg.id)}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-2">
                        <AvatarImage 
                          src={hg.photoUrl || undefined} 
                          alt={`Photo of ${hg.firstName} ${hg.lastName}`}
                        />
                        <AvatarFallback>
                          {hg.firstName[0]}{hg.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm">
                        {hg.firstName} {hg.lastName}
                      </p>
                    </div>
                  </div>
                )
              })}
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={onPicksSubmit}
                disabled={selectedHouseguests.length !== 5}
              >
                Complete Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
