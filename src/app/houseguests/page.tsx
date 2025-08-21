'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { Houseguest, pointsForHG } from '@/types'

export default function HouseguestsPage() {
  const [houseguests, setHouseguests] = useState<Houseguest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'IN' | 'EVICTED'>('ALL')

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

  const filteredHouseguests = houseguests.filter(hg => {
    const matchesSearch = `${hg.firstName} ${hg.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || hg.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading houseguests...</p>
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
            Season 27 Houseguests
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse all contestants and their competition stats
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search houseguests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: 'ALL' | 'IN' | 'EVICTED') => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Houseguests</SelectItem>
              <SelectItem value="IN">Still In Game</SelectItem>
              <SelectItem value="EVICTED">Evicted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Houseguests Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredHouseguests.map((hg) => {
            const totalPoints = pointsForHG(hg)
            const totalWins = hg.wins.hoh.length + hg.wins.pov.length + hg.wins.blockbuster.length

            return (
              <Link key={hg.id} href={`/houseguests/${hg.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader className="text-center pb-2">
                    <Avatar className="w-20 h-20 mx-auto mb-3">
                      <AvatarImage src={hg.photoUrl || undefined} />
                      <AvatarFallback className="text-lg">
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
                  <CardContent className="pt-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Points:</span>
                        <span className="font-semibold">{totalPoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Competition Wins:</span>
                        <span className="font-semibold">{totalWins}</span>
                      </div>
                      
                      {/* Win Badges */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {hg.wins.hoh.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            HOH ×{hg.wins.hoh.length}
                          </Badge>
                        )}
                        {hg.wins.pov.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            POV ×{hg.wins.pov.length}
                          </Badge>
                        )}
                        {hg.wins.blockbuster.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Blockbuster ×{hg.wins.blockbuster.length}
                          </Badge>
                        )}
                      </div>

                      {hg.status === 'EVICTED' && hg.eviction && (
                        <div className="text-xs text-gray-500 mt-2">
                          Evicted Week {hg.eviction.week}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
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
