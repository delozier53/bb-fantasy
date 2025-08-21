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
          <h1 className="text-3xl font-bold text-white">
            Houseguests
          </h1>
        </div>

        {/* Houseguests List */}
        <div 
          className="space-y-3"
          role="list"
          aria-label="Houseguests list"
        >
          {filteredHouseguests.map((hg) => {
            const totalPoints = pointsForHG(hg)
            const totalWins = hg.wins.hoh.length + hg.wins.pov.length + hg.wins.blockbuster.length

            return (
              <Link 
                key={hg.id} 
                href={`/houseguests/${hg.slug}`}
                aria-label={`View profile for ${hg.firstName} ${hg.lastName} - ${totalPoints} points, ${hg.status === 'IN' ? 'still in game' : 'evicted'}`}
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 hover:bg-white transition-all duration-200 active:scale-98 cursor-pointer">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <Avatar className="w-12 h-12 ring-2 ring-amber-200">
                      <AvatarImage 
                        src={hg.photoUrl || undefined} 
                        alt={`Photo of ${hg.firstName} ${hg.lastName}`}
                      />
                      <AvatarFallback className="text-sm bg-amber-100 text-amber-800">
                        {hg.firstName[0]}{hg.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Name and Status */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-slate-800 truncate">
                          {hg.firstName} {hg.lastName}
                        </h3>
                        <Badge 
                          variant={hg.status === 'IN' ? 'default' : 'secondary'} 
                          className={`text-xs ${hg.status === 'IN' ? 'gold-accent' : ''}`}
                        >
                          {hg.status === 'IN' ? 'In Game' : 'Evicted'}
                        </Badge>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-slate-600">
                          <span className="font-medium gold-text">{totalPoints}</span> pts
                        </span>
                        <span className="text-slate-600">
                          <span className="font-medium gold-text">{totalWins}</span> wins
                        </span>
                      </div>
                      
                      {/* Win Badges */}
                      {(hg.wins.hoh.length > 0 || hg.wins.pov.length > 0 || hg.wins.blockbuster.length > 0) && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {hg.wins.hoh.length > 0 && (
                            <Badge variant="outline" className="text-xs border-amber-200 text-amber-700">
                              HOH ×{hg.wins.hoh.length}
                            </Badge>
                          )}
                          {hg.wins.pov.length > 0 && (
                            <Badge variant="outline" className="text-xs border-amber-200 text-amber-700">
                              POV ×{hg.wins.pov.length}
                            </Badge>
                          )}
                          {hg.wins.blockbuster.length > 0 && (
                            <Badge variant="outline" className="text-xs border-amber-200 text-amber-700">
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
                  {hg.status === 'EVICTED' && hg.eviction && (
                    <div className="text-xs text-slate-500 mt-2 ml-16">
                      Evicted Week {hg.eviction.week}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
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
