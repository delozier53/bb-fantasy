'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award } from 'lucide-react'
import { LeaderboardRowSkeleton } from '@/components/ui/skeleton'
import { LeaderboardEntry } from '@/types'

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard')
        if (!response.ok) throw new Error('Failed to fetch leaderboard')
        const data = await response.json()
        setLeaderboard(data)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-600">{rank}</span>
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Leaderboard
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Loading rankings...
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <LeaderboardRowSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fantasy League Leaderboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how everyone&apos;s picks are performing this season
          </p>
        </div>

        {leaderboard.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <p className="text-gray-600 mb-4">No players have made picks yet.</p>
              <Link 
                href="/welcome" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Be the first to join!
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <div className="md:order-1 flex justify-center">
                  <Card className="w-full max-w-xs bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                    <CardContent className="text-center pt-6 pb-4">
                      <div className="mb-3">
                        <Medal className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                          2nd Place
                        </Badge>
                      </div>
                      <Link href={`/u/${leaderboard[1].username}`}>
                        <Avatar className="w-16 h-16 mx-auto mb-3 cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all">
                          <AvatarImage 
                            src={leaderboard[1].photoUrl || undefined} 
                            alt={`Profile photo of ${leaderboard[1].username}`}
                          />
                          <AvatarFallback>
                            {leaderboard[1].username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <h3 className="font-bold text-lg">{leaderboard[1].username}</h3>
                      <p className="text-2xl font-bold text-gray-600">{leaderboard[1].totalPoints} pts</p>
                      <p className="text-sm text-gray-500">{leaderboard[1].remainingCount} remaining</p>
                    </CardContent>
                  </Card>
                </div>

                {/* 1st Place */}
                <div className="md:order-2 flex justify-center">
                  <Card className="w-full max-w-xs bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 transform md:scale-110">
                    <CardContent className="text-center pt-6 pb-4">
                      <div className="mb-3">
                        <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          1st Place
                        </Badge>
                      </div>
                      <Link href={`/u/${leaderboard[0].username}`}>
                        <Avatar className="w-20 h-20 mx-auto mb-3 cursor-pointer hover:ring-2 hover:ring-yellow-300 transition-all">
                          <AvatarImage 
                            src={leaderboard[0].photoUrl || undefined} 
                            alt={`Profile photo of ${leaderboard[0].username}`}
                          />
                          <AvatarFallback>
                            {leaderboard[0].username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <h3 className="font-bold text-xl">{leaderboard[0].username}</h3>
                      <p className="text-3xl font-bold text-yellow-600">{leaderboard[0].totalPoints} pts</p>
                      <p className="text-sm text-gray-600">{leaderboard[0].remainingCount} remaining</p>
                    </CardContent>
                  </Card>
                </div>

                {/* 3rd Place */}
                <div className="md:order-3 flex justify-center">
                  <Card className="w-full max-w-xs bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                    <CardContent className="text-center pt-6 pb-4">
                      <div className="mb-3">
                        <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          3rd Place
                        </Badge>
                      </div>
                      <Link href={`/u/${leaderboard[2].username}`}>
                        <Avatar className="w-16 h-16 mx-auto mb-3 cursor-pointer hover:ring-2 hover:ring-amber-300 transition-all">
                          <AvatarImage 
                            src={leaderboard[2].photoUrl || undefined} 
                            alt={`Profile photo of ${leaderboard[2].username}`}
                          />
                          <AvatarFallback>
                            {leaderboard[2].username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <h3 className="font-bold text-lg">{leaderboard[2].username}</h3>
                      <p className="text-2xl font-bold text-amber-600">{leaderboard[2].totalPoints} pts</p>
                      <p className="text-sm text-gray-500">{leaderboard[2].remainingCount} remaining</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Full Rankings */}
            <Card>
              <CardHeader>
                <CardTitle>Full Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => {
                    const rank = index + 1
                    return (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center">
                            {getRankIcon(rank)}
                          </div>
                          
                          <Link href={`/u/${entry.username}`}>
                            <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all">
                              <AvatarImage 
                                src={entry.photoUrl || undefined} 
                                alt={`Profile photo of ${entry.username}`}
                              />
                              <AvatarFallback>
                                {entry.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                          
                          <div>
                            <Link 
                              href={`/u/${entry.username}`}
                              className="font-semibold text-lg hover:text-blue-600 transition-colors"
                            >
                              {entry.username}
                            </Link>
                            <p className="text-sm text-gray-600">
                              {entry.remainingCount} houseguests remaining
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {entry.totalPoints}
                          </div>
                          <div className="text-sm text-gray-500">points</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Instructions for new users */}
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardContent className="text-center py-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Want to join the competition?
                </h3>
                <p className="text-blue-700 mb-4">
                  Pick your 5 favorite houseguests and start earning points for their competition wins!
                </p>
                <Link 
                  href="/welcome"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
