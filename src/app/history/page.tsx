'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Key, Circle, Minus, RotateCcw, Users, Calendar, Clock, X, Skull, Edit } from 'lucide-react'
import { WeekPanelSkeleton } from '@/components/ui/skeleton'
import { EditWeekPopup } from '@/components/ui/edit-week-popup'
import { Week, Houseguest } from '@/types'

export default function HistoryPage() {
  const { data: session } = useSession()
  const [weeks, setWeeks] = useState<Week[]>([])
  const [loading, setLoading] = useState(true)
  const [houseguests, setHouseguests] = useState<Houseguest[]>([])
  const [houseguestsMap, setHouseguestsMap] = useState<Record<string, { firstName: string; lastName: string }>>({})
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null)
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false)
  const [creatingWeek, setCreatingWeek] = useState(false)

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
        
        setHouseguests(houseguestsData)
        
        const houseguestsMap: Record<string, { firstName: string; lastName: string }> = {}
        houseguestsData.forEach((hg: { id: string; firstName: string; lastName: string }) => {
          houseguestsMap[hg.id] = { firstName: hg.firstName, lastName: hg.lastName }
        })
        setHouseguestsMap(houseguestsMap)
      } catch (error) {
        console.error('Error fetching history data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getHouseguestName = (id: string) => {
    const hg = houseguestsMap[id]
    return hg ? hg.firstName : 'Unknown'
  }

  const handleEditWeek = (week: Week) => {
    setSelectedWeek(week)
    setIsEditPopupOpen(true)
  }

  const handleCloseEditPopup = () => {
    setSelectedWeek(null)
    setIsEditPopupOpen(false)
  }

  const handleSaveWeek = async (weekData: Partial<Week>) => {
    if (!selectedWeek) return

    try {
      const response = await fetch(`/api/admin/week/${selectedWeek.week}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weekData),
      })

      if (!response.ok) {
        throw new Error('Failed to update week')
      }

      // Refresh the weeks data
      const weeksResponse = await fetch('/api/history?desc=1')
      if (weeksResponse.ok) {
        const weeksData = await weeksResponse.json()
        setWeeks(weeksData)
      }
    } catch (error) {
      console.error('Error updating week:', error)
      throw error
    }
  }

  const handleCreateNewWeek = async () => {
    setCreatingWeek(true)
    
    try {
      const response = await fetch('/api/admin/week/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create new week')
      }

      const newWeek = await response.json()
      
      // Refresh the weeks data
      const weeksResponse = await fetch('/api/history?desc=1')
      if (weeksResponse.ok) {
        const weeksData = await weeksResponse.json()
        setWeeks(weeksData)
      }

      // Open the edit popup for the new week
      setSelectedWeek(newWeek)
      setIsEditPopupOpen(true)
    } catch (error) {
      console.error('Error creating new week:', error)
      alert('Failed to create new week. Please try again.')
    } finally {
      setCreatingWeek(false)
    }
  }

  // Check if current user is admin
  const isAdmin = session?.user?.email === 'joshuamdelozier@gmail.com'

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
      <div className="min-h-screen navy-gradient">
        <div className="mobile-container px-4 py-6">
          <div className="text-center mb-8">
            {/* App Logo */}
            <div className="flex justify-center mb-4">
              <img 
                src="/logo.svg" 
                alt="Big Brother Fantasy League Logo" 
                className="w-12 h-12"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Season History
            </h1>
            <p className="text-white/80">
              Loading competition results...
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <WeekPanelSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen navy-gradient">
      <div className="mobile-container px-4 py-6">
        <div className="text-center mb-8">
          {/* App Logo */}
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.svg" 
              alt="Big Brother Fantasy League Logo" 
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Season History
          </h1>
          
          {/* Admin Create New Week Button */}
          {isAdmin && (
            <div className="mt-6">
              <Button
                onClick={handleCreateNewWeek}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2"
                disabled={creatingWeek}
              >
                {creatingWeek ? 'Creating...' : 'Create New Week'}
              </Button>
            </div>
          )}
        </div>

        {weeks.length === 0 ? (
          <Card className="navy-card max-w-md mx-auto">
            <CardContent className="text-center py-8">
              <Calendar className="w-12 h-12 text-white/60 mx-auto mb-4" />
              <p className="text-white/80">
                No week data has been added yet.
              </p>
              <p className="text-sm text-white/60 mt-2">
                Check back after the season begins!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4" role="region" aria-label="Weekly competition history">
              {weeks.map((week) => {
                const hasData = week.hohCompetition || week.hohWinnerId || week.nominees?.length || 
                               week.povCompetition || week.povWinnerId || week.blockbusterCompetition || 
                               week.blockbusterWinnerId || week.evictedNomineeId

                return (
                  <AccordionItem key={week.week} value={`week-${week.week}`} className="navy-card border-white/20 relative">
                    <AccordionTrigger 
                      className="px-6 py-4 hover:no-underline focus:ring-2 focus:ring-amber-400 focus:outline-none text-white"
                      aria-label={`Week ${week.week} competition results - ${hasData ? 'has data' : 'no data yet'}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            <span className="text-xl font-bold text-blue-400">Week {week.week}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <Clock className="w-4 h-4" />
                          {formatDate(week.updatedAt)}
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    {/* Admin Edit Button */}
                    {isAdmin && (
                      <div className="absolute top-4 right-16 z-10">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditWeek(week)
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-white p-2"
                          size="sm"
                          title="Edit Week"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <AccordionContent className="px-6 pb-6">
                      {!hasData ? (
                        <div className="text-center py-8 text-white/60">
                          <p>No data has been entered for this week yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-6 pt-4">
                          {/* HOH Competition */}
                          {(week.hohCompetition || week.hohWinnerId) && (
                            <Card className="navy-card">
                              <CardHeader className="pb-0">
                                <CardTitle className="flex items-center gap-2 text-lg text-amber-400">
                                  <Key className="w-5 h-5 text-amber-400" />
                                  Head of Household
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {week.hohCompetition && (
                                  <p className="text-amber-400/80">
                                    <span className="font-medium">Competition:</span> {week.hohCompetition}
                                  </p>
                                )}
                                {week.hohWinnerId && (
                                  <p className="text-amber-400/80">
                                    <span className="font-medium">Winner:</span>{' '}
                                    <Badge variant="outline" className="ml-1 bg-amber-100 text-amber-800 border-amber-200">
                                      {getHouseguestName(week.hohWinnerId)}
                                    </Badge>
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          )}

                          {/* Nominees */}
                          {week.nominees && week.nominees.length > 0 && (
                            <Card className="navy-card">
                              <CardHeader className="pb-0">
                                <CardTitle className="flex items-center gap-2 text-lg text-red-400">
                                  <X className="w-5 h-5 text-red-400" />
                                  Nominees
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-2">
                                  {week.nominees.map((nomineeId) => (
                                    nomineeId && (
                                      <Badge key={nomineeId} variant="outline" className="text-red-300 border-red-400/30">
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
                            <Card className="navy-card">
                              <CardHeader className="pb-0">
                                <CardTitle className="flex items-center gap-2 text-lg text-blue-400">
                                  <div className="relative w-5 h-5">
                                    <Circle className="w-5 h-5 text-blue-400" />
                                    <Minus className="w-4 h-4 text-blue-400 absolute top-0.5 left-0.5" />
                                  </div>
                                  Power of Veto
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {week.povCompetition && (
                                  <p className="text-blue-400/80">
                                    <span className="font-medium">Competition:</span> {week.povCompetition}
                                  </p>
                                )}
                                {week.povWinnerId && (
                                  <p className="text-blue-400/80">
                                    <span className="font-medium">Winner:</span>{' '}
                                    <Badge variant="outline" className="ml-1 bg-blue-100 text-blue-800 border-blue-200">
                                      {getHouseguestName(week.povWinnerId)}
                                    </Badge>
                                  </p>
                                )}
                                {week.povUsed !== null && (
                                  <p className="text-blue-400/80">
                                    <span className="font-medium">POV Used:</span>{' '}
                                    <Badge variant={week.povUsed ? 'default' : 'secondary'} className={week.povUsed ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                                      {week.povUsed ? 'Yes' : 'No'}
                                    </Badge>
                                  </p>
                                )}
                                {week.povUsed && week.povRemovedNomineeId && week.povReplacementId && (
                                  <div className="mt-3 p-3 bg-blue-400/20 rounded-lg">
                                    <p className="text-sm text-blue-400/80">
                                      <span className="font-medium">Removed:</span>{' '}
                                      {getHouseguestName(week.povRemovedNomineeId)}
                                    </p>
                                    <p className="text-sm text-blue-400/80">
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
                            <Card className="navy-card">
                              <CardHeader className="pb-0">
                                <CardTitle className="flex items-center gap-2 text-lg text-purple-400">
                                  <RotateCcw className="w-5 h-5 text-purple-400" />
                                  BB Blockbuster
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {week.blockbusterCompetition && (
                                  <p className="text-purple-400/80">
                                    <span className="font-medium">Competition:</span> {week.blockbusterCompetition}
                                  </p>
                                )}
                                {week.blockbusterWinnerId && (
                                  <p className="text-purple-400/80">
                                    <span className="font-medium">Winner:</span>{' '}
                                    <Badge variant="outline" className="ml-1 bg-purple-100 text-purple-800 border-purple-200">
                                      {getHouseguestName(week.blockbusterWinnerId)}
                                    </Badge>
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          )}

                          {/* Eviction */}
                          {(week.evictedNomineeId || week.evictionVote) && (
                            <Card className="navy-card border-red-400/30">
                              <CardHeader className="pb-0">
                                <CardTitle className="flex items-center gap-2 text-lg text-black">
                                  <Skull className="w-5 h-5 text-black" />
                                  Eviction
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {week.evictedNomineeId && (
                                  <p className="text-black">
                                    <span className="font-medium">Evicted:</span>{' '}
                                    <Badge variant="outline" className="ml-1 bg-black text-white border-black">
                                      {getHouseguestName(week.evictedNomineeId)}
                                    </Badge>
                                  </p>
                                )}
                                {week.evictionVote && (
                                  <p className="text-black">
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

      {/* Edit Week Popup */}
      <EditWeekPopup
        isOpen={isEditPopupOpen}
        onClose={handleCloseEditPopup}
        week={selectedWeek}
        houseguests={houseguests}
        onSave={handleSaveWeek}
      />
    </div>
  )
}
