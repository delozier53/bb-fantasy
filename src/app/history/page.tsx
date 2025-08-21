'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Crown, Shield, Zap, Users, Calendar, Clock } from 'lucide-react'
import { Week } from '@/types'

export default function HistoryPage() {
  const [weeks, setWeeks] = useState<Week[]>([])
  const [loading, setLoading] = useState(true)
  const [houseguests, setHouseguests] = useState<Record<string, { firstName: string; lastName: string }>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch weeks in reverse chronological order
        const weeksResponse = await fetch('/api/history?desc=1')
        if (!weeksResponse.ok) throw new Error('Failed to fetch weeks')
        const weeksData = await weeksResponse.json()
        setWeeks(weeksData)

        // Fetch houseguests for name lookup
        const houseguestsResponse = await fetch('/api/houseguests')
        if (!houseguestsResponse.ok) throw new Error('Failed to fetch houseguests')
        const houseguestsData = await houseguestsResponse.json()
        
        const houseguestsMap: Record<string, { firstName: string; lastName: string }> = {}
        houseguestsData.forEach((hg: any) => {
          houseguestsMap[hg.id] = { firstName: hg.firstName, lastName: hg.lastName }
        })
        setHouseguests(houseguestsMap)
      } catch (error) {
        console.error('Error fetching history data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getHouseguestName = (id: string) => {
    const hg = houseguests[id]
    return hg ? `${hg.firstName} ${hg.lastName}` : 'Unknown'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading season history...</p>
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
            Season 27 History
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Week-by-week competition results and evictions
          </p>
        </div>

        {weeks.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No week data has been added yet.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Check back after the season begins!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {weeks.map((week) => {
                const hasData = week.hohCompetition || week.hohWinnerId || week.nominees?.length || 
                               week.povCompetition || week.povWinnerId || week.blockbusterCompetition || 
                               week.blockbusterWinnerId || week.evictedNomineeId

                return (
                  <AccordionItem key={week.week} value={`week-${week.week}`} className="border rounded-lg">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span className="text-xl font-bold">Week {week.week}</span>
                          </div>
                          {hasData && (
                            <Badge variant="default" className="ml-2">
                              Updated
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {formatDate(week.updatedAt)}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      {!hasData ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>No data has been entered for this week yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* HOH Competition */}
                          {(week.hohCompetition || week.hohWinnerId) && (
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                  <Crown className="w-5 h-5 text-yellow-600" />
                                  Head of Household
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {week.hohCompetition && (
                                  <p className="text-gray-700">
                                    <span className="font-medium">Competition:</span> {week.hohCompetition}
                                  </p>
                                )}
                                {week.hohWinnerId && (
                                  <p className="text-gray-700">
                                    <span className="font-medium">Winner:</span>{' '}
                                    <Badge variant="outline" className="ml-1">
                                      {getHouseguestName(week.hohWinnerId)}
                                    </Badge>
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          )}

                          {/* Nominees */}
                          {week.nominees && week.nominees.length > 0 && (
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                  <Users className="w-5 h-5 text-red-600" />
                                  Nominees
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {week.nominees.map((nomineeId, index) => (
                                    nomineeId && (
                                      <Badge key={nomineeId} variant="outline" className="text-red-700 border-red-300">
                                        {getHouseguestName(nomineeId)}
                                      </Badge>
                                    )
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* POV Competition */}
                          {(week.povCompetition || week.povWinnerId || week.povUsed !== null) && (
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                  <Shield className="w-5 h-5 text-blue-600" />
                                  Power of Veto
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {week.povCompetition && (
                                  <p className="text-gray-700">
                                    <span className="font-medium">Competition:</span> {week.povCompetition}
                                  </p>
                                )}
                                {week.povWinnerId && (
                                  <p className="text-gray-700">
                                    <span className="font-medium">Winner:</span>{' '}
                                    <Badge variant="outline" className="ml-1">
                                      {getHouseguestName(week.povWinnerId)}
                                    </Badge>
                                  </p>
                                )}
                                {week.povUsed !== null && (
                                  <p className="text-gray-700">
                                    <span className="font-medium">POV Used:</span>{' '}
                                    <Badge variant={week.povUsed ? 'default' : 'secondary'}>
                                      {week.povUsed ? 'Yes' : 'No'}
                                    </Badge>
                                  </p>
                                )}
                                {week.povUsed && week.povRemovedNomineeId && week.povReplacementId && (
                                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                      <span className="font-medium">Removed:</span>{' '}
                                      {getHouseguestName(week.povRemovedNomineeId)}
                                    </p>
                                    <p className="text-sm text-blue-800">
                                      <span className="font-medium">Replacement:</span>{' '}
                                      {getHouseguestName(week.povReplacementId)}
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}

                          {/* Blockbuster Competition */}
                          {(week.blockbusterCompetition || week.blockbusterWinnerId) && (
                            <Card>
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                  <Zap className="w-5 h-5 text-purple-600" />
                                  BB Blockbuster
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {week.blockbusterCompetition && (
                                  <p className="text-gray-700">
                                    <span className="font-medium">Competition:</span> {week.blockbusterCompetition}
                                  </p>
                                )}
                                {week.blockbusterWinnerId && (
                                  <p className="text-gray-700">
                                    <span className="font-medium">Winner:</span>{' '}
                                    <Badge variant="outline" className="ml-1">
                                      {getHouseguestName(week.blockbusterWinnerId)}
                                    </Badge>
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          )}

                          {/* Eviction */}
                          {(week.evictedNomineeId || week.evictionVote) && (
                            <Card className="border-red-200 bg-red-50">
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg text-red-800">
                                  <Users className="w-5 h-5 text-red-600" />
                                  Eviction
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {week.evictedNomineeId && (
                                  <p className="text-red-800">
                                    <span className="font-medium">Evicted:</span>{' '}
                                    <Badge variant="destructive" className="ml-1">
                                      {getHouseguestName(week.evictedNomineeId)}
                                    </Badge>
                                  </p>
                                )}
                                {week.evictionVote && (
                                  <p className="text-red-800">
                                    <span className="font-medium">Vote:</span> {week.evictionVote}
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  )
}
