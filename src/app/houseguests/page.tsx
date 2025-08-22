'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Houseguest, pointsForHG } from '@/types'

export default function HouseguestsPage() {
  const [houseguests, setHouseguests] = useState<Houseguest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHouseguests = async () => {
      try {
        const response = await fetch('/api/houseguests')
        if (!response.ok) throw new Error('Failed to fetch houseguests')
        const data = await response.json()
        setHouseguests(data)
      } catch (error) {
        console.error('Error fetching houseguests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHouseguests()
  }, [])

  const filteredHouseguests = houseguests

  if (loading) {
    return (
      <div className="min-h-screen navy-gradient">
        <div className="px-4 py-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Houseguests
            </h1>
          </div>
          
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-white/20 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen navy-gradient">
      <div className="px-4 py-6">
        <div className="text-center mb-6">
          {/* App Logo */}
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.svg" 
              alt="Big Brother Fantasy League Logo" 
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Houseguests
          </h1>
        </div>

        {/* Houseguests Sections */}
        <div className="space-y-6">
          {/* In the House Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">In the House</h2>
            <div>
              {filteredHouseguests
                .filter(hg => hg.status === 'IN')
                .sort((a, b) => {
                  const aWins = a.wins.hoh.length + a.wins.pov.length + a.wins.blockbuster.length
                  const bWins = b.wins.hoh.length + b.wins.pov.length + b.wins.blockbuster.length
                  return bWins - aWins // Most wins first
                })
                .map((hg) => {
                  const totalPoints = pointsForHG(hg)
                  const totalWins = hg.wins.hoh.length + hg.wins.pov.length + hg.wins.blockbuster.length

                  return (
                    <div key={hg.id} className="mb-4 last:mb-0">
                      <Link 
                        href={`/houseguests/${hg.slug}`}
                        aria-label={`View profile for ${hg.firstName} - ${totalPoints} points`}
                      >
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 hover:bg-white transition-all duration-200 active:scale-98 cursor-pointer">
                          <div className="flex items-center space-x-4">
                            {/* Avatar */}
                            <Avatar className="w-12 h-12 ring-2 ring-amber-200">
                              <AvatarImage 
                                src={hg.photoUrl || undefined} 
                                alt={`Photo of ${hg.firstName}`}
                              />
                              <AvatarFallback className="text-sm bg-amber-100 text-amber-800">
                                {hg.firstName[0]}
                              </AvatarFallback>
                            </Avatar>
                            
                            {/* Name and Stats */}
                            <div className="flex-1 min-w-0">
                                                          <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-bold text-slate-800 text-lg">
                                {hg.firstName}
                              </h3>
                              <span className="text-sm font-semibold gold-text">
                                {totalPoints} pts
                              </span>
                            </div>
                              
                              {/* Win Badges */}
                              {(hg.wins.hoh.length > 0 || hg.wins.pov.length > 0 || hg.wins.blockbuster.length > 0) && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {hg.wins.hoh.length > 0 && (
                                    <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-50">
                                      HOH ×{hg.wins.hoh.length}
                                    </Badge>
                                  )}
                                  {hg.wins.pov.length > 0 && (
                                    <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 bg-blue-50">
                                      POV ×{hg.wins.pov.length}
                                    </Badge>
                                  )}
                                  {hg.wins.blockbuster.length > 0 && (
                                    <Badge variant="outline" className="text-xs border-purple-300 text-purple-700 bg-purple-50">
                                      BB ×{hg.wins.blockbuster.length}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Arrow indicator */}
                            <div className="text-slate-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* In Jury Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">In Jury</h2>
            <div>
              {filteredHouseguests
                .filter(hg => hg.status === 'JURY')
                .sort((a, b) => {
                  const aWins = a.wins.hoh.length + a.wins.pov.length + a.wins.blockbuster.length
                  const bWins = b.wins.hoh.length + b.wins.pov.length + b.wins.blockbuster.length
                  return bWins - aWins // Most wins first
                })
                .map((hg) => {
                  const totalPoints = pointsForHG(hg)
                  const totalWins = hg.wins.hoh.length + hg.wins.pov.length + hg.wins.blockbuster.length

                  return (
                    <div key={hg.id} className="mb-4 last:mb-0">
                      <Link 
                        href={`/houseguests/${hg.slug}`}
                        aria-label={`View profile for ${hg.firstName} - ${totalPoints} points`}
                      >
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 hover:bg-white transition-all duration-200 active:scale-98 cursor-pointer">
                          <div className="flex items-center space-x-4">
                            {/* Avatar */}
                            <Avatar className="w-12 h-12 ring-2 ring-amber-200">
                              <AvatarImage 
                                src={hg.photoUrl || undefined} 
                                alt={`Photo of ${hg.firstName}`}
                              />
                              <AvatarFallback className="text-sm bg-amber-100 text-amber-800">
                                {hg.firstName[0]}
                              </AvatarFallback>
                            </Avatar>
                            
                            {/* Name and Stats */}
                            <div className="flex-1 min-w-0">
                                                          <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-bold text-slate-800 text-lg">
                                {hg.firstName}
                              </h3>
                              <span className="text-sm font-semibold gold-text">
                                {totalPoints} pts
                              </span>
                            </div>
                              
                              {/* Win Badges */}
                              {(hg.wins.hoh.length > 0 || hg.wins.pov.length > 0 || hg.wins.blockbuster.length > 0) && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {hg.wins.hoh.length > 0 && (
                                    <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-50">
                                      HOH ×{hg.wins.hoh.length}
                                    </Badge>
                                  )}
                                  {hg.wins.pov.length > 0 && (
                                    <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 bg-blue-50">
                                      POV ×{hg.wins.pov.length}
                                    </Badge>
                                  )}
                                  {hg.wins.blockbuster.length > 0 && (
                                    <Badge variant="outline" className="text-xs border-purple-300 text-purple-700 bg-purple-50">
                                      BB ×{hg.wins.blockbuster.length}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Arrow indicator */}
                            <div className="text-slate-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Not in Jury Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Not in Jury</h2>
            <div>
              {filteredHouseguests
                .filter(hg => hg.status === 'EVICTED')
                .sort((a, b) => {
                  const aWins = a.wins.hoh.length + a.wins.pov.length + a.wins.blockbuster.length
                  const bWins = b.wins.hoh.length + b.wins.pov.length + b.wins.blockbuster.length
                  return bWins - aWins // Most wins first
                })
                .map((hg) => {
                  const totalPoints = pointsForHG(hg)
                  const totalWins = hg.wins.hoh.length + hg.wins.pov.length + hg.wins.blockbuster.length

                  return (
                    <div key={hg.id} className="mb-4 last:mb-0">
                      <Link 
                        href={`/houseguests/${hg.slug}`}
                        aria-label={`View profile for ${hg.firstName} - ${totalPoints} points`}
                      >
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 hover:bg-white transition-all duration-200 active:scale-98 cursor-pointer">
                          <div className="flex items-center space-x-4">
                            {/* Avatar */}
                            <Avatar className="w-12 h-12 ring-2 ring-amber-200">
                              <AvatarImage 
                                src={hg.photoUrl || undefined} 
                                alt={`Photo of ${hg.firstName}`}
                              />
                              <AvatarFallback className="text-sm bg-amber-100 text-amber-800">
                                {hg.firstName[0]}
                              </AvatarFallback>
                            </Avatar>
                            
                            {/* Name and Stats */}
                            <div className="flex-1 min-w-0">
                                                          <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-bold text-slate-800 text-lg">
                                {hg.firstName}
                              </h3>
                              <span className="text-sm font-semibold gold-text">
                                {totalPoints} pts
                              </span>
                            </div>
                              
                              {/* Win Badges */}
                              {(hg.wins.hoh.length > 0 || hg.wins.pov.length > 0 || hg.wins.blockbuster.length > 0) && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {hg.wins.hoh.length > 0 && (
                                    <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 bg-amber-50">
                                      HOH ×{hg.wins.hoh.length}
                                    </Badge>
                                  )}
                                  {hg.wins.pov.length > 0 && (
                                    <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 bg-blue-50">
                                      POV ×{hg.wins.pov.length}
                                    </Badge>
                                  )}
                                  {hg.wins.blockbuster.length > 0 && (
                                    <Badge variant="outline" className="text-xs border-purple-300 text-purple-700 bg-purple-50">
                                      BB ×{hg.wins.blockbuster.length}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Arrow indicator */}
                            <div className="text-slate-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Eviction info */}
                          {hg.eviction && (
                            <div className="text-xs text-slate-500 mt-2 ml-16">
                              Evicted Week {hg.eviction.week}
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {filteredHouseguests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No houseguests found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
