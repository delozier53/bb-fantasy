'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Key, RotateCcw, Trophy, Target, Circle, Minus } from 'lucide-react'
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

  return (
    <div className="min-h-screen navy-gradient">
      <div className="mobile-container">
        {/* Back Button */}
        <div className="pt-6 pb-4">
          <Link href="/houseguests">
            <Button variant="ghost" className="text-blue-400 hover:bg-blue-400/10 p-2 h-auto">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
        </div>

        {/* Profile Header */}
        <div className="text-center mb-8">
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
          <div className="flex items-center justify-center space-x-4 text-white/80">
            <span className="text-lg font-semibold gold-text">{totalPoints} pts</span>
            <span>•</span>
            <span>{totalWins} comp wins</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4 mb-8 pb-6">
          {/* HOH Wins */}
          <Card className="navy-card">
            <CardHeader>
              <CardTitle className="text-white">
                HOH Wins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4">
                <Key className="w-10 h-10 text-amber-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-amber-400 mb-1">
                  {houseguest.wins.hoh.length > 0 ? houseguest.wins.hoh.join(', ') : 'No Wins'}
                </div>
                <div className="text-sm text-white/80">Head of Household</div>
              </div>
            </CardContent>
          </Card>

          {/* POV Wins */}
          <Card className="navy-card">
            <CardHeader>
              <CardTitle className="text-white">
                POV Wins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4">
                <div className="relative w-10 h-10 mx-auto mb-1">
                  <Circle className="w-10 h-10 text-blue-400" />
                  <Minus className="w-8 h-8 text-blue-400 absolute top-1 left-1" />
                </div>
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {houseguest.wins.pov.length > 0 ? houseguest.wins.pov.join(', ') : 'No Wins'}
                </div>
                <div className="text-sm text-white/80">Power of Veto</div>
              </div>
            </CardContent>
          </Card>

          {/* Blockbuster Wins */}
          <Card className="navy-card">
            <CardHeader>
              <CardTitle className="text-white">
                Blockbuster Wins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4">
                <RotateCcw className="w-10 h-10 text-purple-400 mx-auto mb-1" />
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {houseguest.wins.blockbuster.length > 0 ? houseguest.wins.blockbuster.join(', ') : 'No Wins'}
                </div>
                <div className="text-sm text-white/80">Blockbuster</div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          {houseguest.bio && (
            <Card className="navy-card">
              <CardHeader>
                <CardTitle className="text-white">Bio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 leading-relaxed">{houseguest.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* On the Block History */}
          {houseguest.onTheBlockWeeks.length > 0 && (
            <Card className="navy-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 gold-text" />
                  On the Block History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {houseguest.onTheBlockWeeks.map((week) => (
                    <Badge key={week} variant="outline" className="border-amber-200/30 text-amber-300">
                      Week {week}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-white/60">
                  Nominated {houseguest.onTheBlockWeeks.length} time{houseguest.onTheBlockWeeks.length !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Eviction Info */}
          {houseguest.status === 'EVICTED' && houseguest.eviction && (
            <Card className="navy-card border-red-400/30">
              <CardHeader>
                <CardTitle className="text-red-300">Eviction Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/80">Week:</span>
                    <span className="text-red-300 font-semibold">{houseguest.eviction.week}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Vote:</span>
                    <span className="text-red-300 font-semibold">{houseguest.eviction.vote}</span>
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
