'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Crown, Shield, Zap } from 'lucide-react'
import { Houseguest, pointsForHG } from '@/types'

export default function HouseguestProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [houseguest, setHouseguest] = useState<Houseguest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const slug = params.slug as string

  useEffect(() => {
    const fetchHouseguest = async () => {
      try {
        const response = await fetch(`/api/houseguests/${slug}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Houseguest not found')
          } else {
            throw new Error('Failed to fetch houseguest')
          }
          return
        }
        const data = await response.json()
        setHouseguest(data)
      } catch (error) {
        console.error('Error fetching houseguest:', error)
        setError('Failed to load houseguest')
      } finally {
        setLoading(false)
      }
    }

    fetchHouseguest()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading houseguest...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !houseguest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Houseguest not found'}
            </h1>
            <Button onClick={() => router.push('/houseguests')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Houseguests
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const totalPoints = pointsForHG(houseguest)
  const totalWins = houseguest.wins.hoh.length + houseguest.wins.pov.length + houseguest.wins.blockbuster.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/houseguests">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Houseguests
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4">
                <AvatarImage src={houseguest.photoUrl || undefined} />
                <AvatarFallback className="text-2xl">
                  {houseguest.firstName[0]}{houseguest.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">
                {houseguest.firstName} {houseguest.lastName}
              </CardTitle>
              <div className="flex justify-center">
                <Badge variant={houseguest.status === 'IN' ? 'default' : 'secondary'} className="text-sm">
                  {houseguest.status === 'IN' ? 'Still In Game' : 'Evicted'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {houseguest.bio && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Bio</h3>
                  <p className="text-gray-600 text-sm">{houseguest.bio}</p>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Points:</span>
                  <span className="text-2xl font-bold text-blue-600">{totalPoints}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Competition Wins:</span>
                  <span className="text-lg font-semibold">{totalWins}</span>
                </div>
              </div>

              {houseguest.status === 'EVICTED' && houseguest.eviction && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-1">Eviction Info</h3>
                  <p className="text-red-700 text-sm">
                    Evicted in Week {houseguest.eviction.week}
                  </p>
                  <p className="text-red-700 text-sm">
                    Vote: {houseguest.eviction.vote}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats and History */}
          <div className="md:col-span-2 space-y-6">
            {/* Competition Wins */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Competition Wins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-800">
                      {houseguest.wins.hoh.length}
                    </div>
                    <div className="text-sm text-yellow-700">HOH Wins</div>
                    {houseguest.wins.hoh.length > 0 && (
                      <div className="text-xs text-yellow-600 mt-1">
                        Weeks: {houseguest.wins.hoh.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-800">
                      {houseguest.wins.pov.length}
                    </div>
                    <div className="text-sm text-blue-700">POV Wins</div>
                    {houseguest.wins.pov.length > 0 && (
                      <div className="text-xs text-blue-600 mt-1">
                        Weeks: {houseguest.wins.pov.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-800">
                      {houseguest.wins.blockbuster.length}
                    </div>
                    <div className="text-sm text-purple-700">Blockbuster Wins</div>
                    {houseguest.wins.blockbuster.length > 0 && (
                      <div className="text-xs text-purple-600 mt-1">
                        Weeks: {houseguest.wins.blockbuster.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* On the Block History */}
            {houseguest.onTheBlockWeeks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>On the Block History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {houseguest.onTheBlockWeeks.map((week) => (
                      <Badge key={week} variant="outline">
                        Week {week}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Nominated {houseguest.onTheBlockWeeks.length} time{houseguest.onTheBlockWeeks.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
