'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Key, RotateCcw, Trophy, Target, Circle, Minus, X, Skull } from 'lucide-react'
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
      <div className="min-h-screen navy-gradient">
        <div className="mobile-container">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-white/80">Loading houseguest...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !houseguest) {
    return (
      <div className="min-h-screen navy-gradient">
        <div className="mobile-container">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-white mb-6">
              {error || 'Houseguest not found'}
            </h1>
            <Button 
              onClick={() => router.push('/houseguests')}
              className="gold-accent"
            >
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

  // Format wins as "Week X"
  const formatWins = (wins: number[]) => {
    if (wins.length === 0) return 'No Wins'
    return wins.map(week => `Week ${week}`).join(', ')
  }

  return (
    <div className="min-h-screen navy-gradient">
      <div className="mobile-container">
        {/* Back Button */}
        <div className="pt-4 pb-4">
          <Link href="/houseguests">
            <Button variant="outline" className="text-blue-400 border-blue-400/30 hover:bg-blue-400/10 p-2 h-auto">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
        </div>

        {/* Profile Header */}
        <div className="text-center mb-6">
          <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-amber-200">
            <AvatarImage 
              src={houseguest.photoUrl || undefined} 
              alt={`Photo of ${houseguest.firstName} ${houseguest.lastName}`}
            />
            <AvatarFallback className="text-xl bg-amber-100 text-amber-800">
              {houseguest.firstName[0]}{houseguest.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold text-white mb-2">
            {houseguest.firstName} {houseguest.lastName}
          </h1>
          
          {/* Bio under name */}
          {houseguest.bio && (
            <div className="mb-4 px-4">
              <div className="text-white/80 text-sm space-y-1">
                {houseguest.bio.split(' | ').map((line, index) => (
                  <p key={index} className="text-center">{line}</p>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center space-x-4 text-white/80">
            <span className="text-lg font-semibold gold-text">{totalPoints} pts</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-3 mb-8 pb-6">
          {/* HOH Wins */}
          <Card className="navy-card">
            <CardContent className="p-3">
              <div className="text-center">
                <Key className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <div className="text-sm font-semibold text-amber-400 mb-1">HOH WINS</div>
                <div className="text-lg font-bold text-amber-400">
                  {formatWins(houseguest.wins.hoh)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* POV Wins */}
          <Card className="navy-card">
            <CardContent className="p-3">
              <div className="text-center">
                <div className="relative w-6 h-6 mx-auto mb-1">
                  <Circle className="w-6 h-6 text-blue-400" />
                  <Minus className="w-4 h-4 text-blue-400 absolute top-1 left-1" />
                </div>
                <div className="text-sm font-semibold text-blue-400 mb-1">POV WINS</div>
                <div className="text-lg font-bold text-blue-400">
                  {formatWins(houseguest.wins.pov)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blockbuster Wins */}
          <Card className="navy-card">
            <CardContent className="p-3">
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <div className="text-sm font-semibold text-purple-400 mb-1">BLOCKBUSTER WINS</div>
                <div className="text-lg font-bold text-purple-400">
                  {formatWins(houseguest.wins.blockbuster)}
                </div>
              </div>
            </CardContent>
          </Card>



          {/* On the Block History */}
          {houseguest.onTheBlockWeeks.length > 0 && (
            <Card className="navy-card">
              <CardContent className="p-3">
                <div className="text-center">
                  <X className="w-6 h-6 text-red-400 mx-auto mb-1" />
                  <div className="text-sm font-semibold text-red-400 mb-1">ON THE BLOCK</div>
                  <div className="text-lg font-bold text-red-400">
                    {formatWins(houseguest.onTheBlockWeeks)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Eviction Info */}
          {houseguest.status === 'EVICTED' && houseguest.eviction && (
            <Card className="navy-card">
              <CardContent className="p-3">
                <div className="text-center">
                  <Skull className="w-6 h-6 text-black mx-auto mb-1" />
                  <div className="text-sm font-semibold text-black mb-1">EVICTED</div>
                  <div className="text-lg font-bold text-black mb-1">
                    Week {houseguest.eviction.week}
                  </div>
                  <div className="text-sm font-semibold text-black">
                    Final Vote: {houseguest.eviction.vote}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
