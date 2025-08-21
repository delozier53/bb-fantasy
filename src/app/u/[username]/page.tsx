'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Crown, Shield, Zap, Users } from 'lucide-react'
import { Houseguest, pointsForHG } from '@/types'

interface UserProfile {
  id: string
  username: string
  photoUrl?: string
  totalPoints: number
  remainingCount: number
}

interface UserProfileData {
  user: UserProfile
  houseguests: Houseguest[]
}

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profileData, setProfileData] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const username = params.username as string

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/users/${username}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('User not found')
          } else {
            throw new Error('Failed to fetch user profile')
          }
          return
        }
        const data = await response.json()
        setProfileData(data)
      } catch (error) {
        console.error('Error fetching user profile:', error)
        setError('Failed to load user profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'User not found'}
            </h1>
            <Button onClick={() => router.push('/leaderboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leaderboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const { user, houseguests } = profileData

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/leaderboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leaderboard
            </Button>
          </Link>
        </div>

        {/* User Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage 
                  src={user.photoUrl || undefined} 
                  alt={`Profile photo of ${user.username}`}
                />
                <AvatarFallback className="text-2xl">
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.username}
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 text-lg">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Crown className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-600">
                      {user.totalPoints} points
                    </span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-600">
                      {user.remainingCount} still in game
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User's Picks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {user.username}&apos;s Team ({houseguests.length}/5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {houseguests.map((hg) => {
                const points = pointsForHG(hg)
                const totalWins = hg.wins.hoh.length + hg.wins.pov.length + hg.wins.blockbuster.length

                return (
                  <Link key={hg.id} href={`/houseguests/${hg.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <CardHeader className="text-center pb-3">
                        <Avatar className="w-16 h-16 mx-auto mb-3">
                          <AvatarImage 
                            src={hg.photoUrl || undefined} 
                            alt={`Photo of ${hg.firstName} ${hg.lastName}`}
                          />
                          <AvatarFallback>
                            {hg.firstName[0]}{hg.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg">
                          {hg.firstName} {hg.lastName}
                        </CardTitle>
                        <div className="flex justify-center">
                          <Badge variant={hg.status === 'IN' ? 'default' : 'secondary'}>
                            {hg.status === 'IN' ? 'In Game' : 'Evicted'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Points:</span>
                            <span className="font-bold text-blue-600">{points}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Wins:</span>
                            <span className="font-semibold">{totalWins}</span>
                          </div>
                        </div>

                        {/* Competition Win Breakdown */}
                        <div className="mt-4 space-y-2">
                          {hg.wins.hoh.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Crown className="w-4 h-4 text-yellow-600" />
                              <span className="text-xs">HOH: {hg.wins.hoh.length}x</span>
                            </div>
                          )}
                          {hg.wins.pov.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-blue-600" />
                              <span className="text-xs">POV: {hg.wins.pov.length}x</span>
                            </div>
                          )}
                          {hg.wins.blockbuster.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-purple-600" />
                              <span className="text-xs">Blockbuster: {hg.wins.blockbuster.length}x</span>
                            </div>
                          )}
                        </div>

                        {hg.status === 'EVICTED' && hg.eviction && (
                          <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-700">
                            Evicted Week {hg.eviction.week}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>

            {houseguests.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  This user hasn&apos;t made their picks yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Stats Summary */}
        {houseguests.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Team Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.totalPoints}
                  </div>
                  <div className="text-sm text-blue-700">Total Points</div>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {user.remainingCount}
                  </div>
                  <div className="text-sm text-green-700">Still In Game</div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {houseguests.reduce((sum, hg) => sum + hg.wins.hoh.length, 0)}
                  </div>
                  <div className="text-sm text-yellow-700">HOH Wins</div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {houseguests.reduce((sum, hg) => sum + hg.wins.pov.length + hg.wins.blockbuster.length, 0)}
                  </div>
                  <div className="text-sm text-purple-700">POV + Blockbuster</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
