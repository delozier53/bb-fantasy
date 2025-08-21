'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, Search } from 'lucide-react'
import { LeaderboardRowSkeleton } from '@/components/ui/skeleton'
import { LeaderboardEntry } from '@/types'

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard')
        if (!response.ok) throw new Error('Failed to fetch leaderboard')
        const data = await response.json()
        setLeaderboard(data)
        setFilteredLeaderboard(data)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  useEffect(() => {
    const filtered = leaderboard.filter(entry =>
      entry.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredLeaderboard(filtered)
  }, [searchQuery, leaderboard])

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
      <div className="min-h-screen navy-gradient">
        <div className="mobile-container">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-white/80">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen navy-gradient">
      <div className="mobile-container">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            Leaderboard
          </h1>
          
          {/* Search Box */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
        </div>

        {filteredLeaderboard.length === 0 ? (
          <Card className="navy-card max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <p className="text-white/80 mb-4">
                {searchQuery ? 'No users found matching your search.' : 'No players have made picks yet.'}
              </p>
              {!searchQuery && (
                <Link 
                  href="/welcome" 
                  className="gold-text hover:text-amber-300 font-medium"
                >
                  Be the first to join!
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Top 3 Podium */}
            {filteredLeaderboard.length >= 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <div className="md:order-1 flex justify-center">
                  <Card className="navy-card w-full max-w-xs">
                    <CardContent className="text-center pt-6 pb-4">
                      <div className="mb-3">
                        <Medal className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                          2nd Place
                        </Badge>
                      </div>
                      <Link href={`/u/${filteredLeaderboard[1].username}`}>
                        <Avatar className="w-16 h-16 mx-auto mb-3 cursor-pointer hover:ring-2 hover:ring-amber-300 transition-all">
                          <AvatarImage 
                            src={filteredLeaderboard[1].photoUrl || undefined} 
                            alt={`Profile photo of ${filteredLeaderboard[1].username}`}
                          />
                          <AvatarFallback>
                            {filteredLeaderboard[1].username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <h3 className="font-bold text-lg text-white">{filteredLeaderboard[1].username}</h3>
                      <p className="text-2xl font-bold gold-text">{filteredLeaderboard[1].totalPoints} pts</p>
                      <p className="text-sm text-white/60">{filteredLeaderboard[1].remainingCount} remaining</p>
                    </CardContent>
                  </Card>
                </div>

                {/* 1st Place */}
                <div className="md:order-2 flex justify-center">
                  <Card className="navy-card w-full max-w-xs transform md:scale-110">
                    <CardContent className="text-center pt-6 pb-4">
                      <div className="mb-3">
                        <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          1st Place
                        </Badge>
                      </div>
                      <Link href={`/u/${filteredLeaderboard[0].username}`}>
                        <Avatar className="w-20 h-20 mx-auto mb-3 cursor-pointer hover:ring-2 hover:ring-amber-300 transition-all">
                          <AvatarImage 
                            src={filteredLeaderboard[0].photoUrl || undefined} 
                            alt={`Profile photo of ${filteredLeaderboard[0].username}`}
                          />
                          <AvatarFallback>
                            {filteredLeaderboard[0].username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <h3 className="font-bold text-xl text-white">{filteredLeaderboard[0].username}</h3>
                      <p className="text-3xl font-bold gold-text">{filteredLeaderboard[0].totalPoints} pts</p>
                      <p className="text-sm text-white/60">{filteredLeaderboard[0].remainingCount} remaining</p>
                    </CardContent>
                  </Card>
                </div>

                {/* 3rd Place */}
                <div className="md:order-3 flex justify-center">
                  <Card className="navy-card w-full max-w-xs">
                    <CardContent className="text-center pt-6 pb-4">
                      <div className="mb-3">
                        <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          3rd Place
                        </Badge>
                      </div>
                      <Link href={`/u/${filteredLeaderboard[2].username}`}>
                        <Avatar className="w-16 h-16 mx-auto mb-3 cursor-pointer hover:ring-2 hover:ring-amber-300 transition-all">
                          <AvatarImage 
                            src={filteredLeaderboard[2].photoUrl || undefined} 
                            alt={`Profile photo of ${filteredLeaderboard[2].username}`}
                          />
                          <AvatarFallback>
                            {filteredLeaderboard[2].username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <h3 className="font-bold text-lg text-white">{filteredLeaderboard[2].username}</h3>
                      <p className="text-2xl font-bold gold-text">{filteredLeaderboard[2].totalPoints} pts</p>
                      <p className="text-sm text-white/60">{filteredLeaderboard[2].remainingCount} remaining</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Full Rankings */}
            <Card className="navy-card">
              <CardHeader>
                <CardTitle className="text-white">Full Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredLeaderboard.map((entry, index) => {
                    const rank = index + 1
                    return (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center">
                            {getRankIcon(rank)}
                          </div>
                          
                          <Link href={`/u/${entry.username}`}>
                            <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-amber-300 transition-all">
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
                              className="font-semibold text-lg text-white hover:text-amber-400 transition-colors"
                            >
                              {entry.username}
                            </Link>
                            <p className="text-sm text-white/60">
                              {entry.remainingCount} houseguests remaining
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold gold-text">
                            {entry.totalPoints}
                          </div>
                          <div className="text-sm text-white/60">points</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Instructions for new users */}
            <Card className="navy-card mt-8">
              <CardContent className="text-center py-6">
                <h3 className="font-semibold text-white mb-2">
                  Want to join the competition?
                </h3>
                <p className="text-white/80 mb-4">
                  Pick your 5 favorite houseguests and start earning points for their competition wins!
                </p>
                <Link 
                  href="/welcome"
                  className="inline-flex items-center px-4 py-2 gold-accent rounded-lg hover:bg-amber-500 transition-colors"
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
