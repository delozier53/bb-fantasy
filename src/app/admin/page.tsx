'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Settings, Users, Calendar, Database, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { Houseguest, Week } from '@/types'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [houseguests, setHouseguests] = useState<Houseguest[]>([])
  const [weeks, setWeeks] = useState<Week[]>([])
  const [selectedWeek, setSelectedWeek] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Week form state
  const [weekForm, setWeekForm] = useState({
    hohCompetition: '',
    hohWinnerId: '',
    nominees: ['', '', ''],
    povCompetition: '',
    povWinnerId: '',
    povUsed: false,
    povRemovedNomineeId: '',
    povReplacementId: '',
    blockbusterCompetition: '',
    blockbusterWinnerId: '',
    evictedNomineeId: '',
    evictionVote: '',
  })

  // Houseguest form state
  const [selectedHouseguest, setSelectedHouseguest] = useState<string>('')
  const [houseguestForm, setHouseguestForm] = useState({
    bio: '',
    photoUrl: '',
  })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [houseguestsRes, weeksRes] = await Promise.all([
        fetch('/api/houseguests'),
        fetch('/api/history'),
      ])

      if (!houseguestsRes.ok || !weeksRes.ok) throw new Error('Failed to fetch data')

      const [houseguestsData, weeksData] = await Promise.all([
        houseguestsRes.json(),
        weeksRes.json(),
      ])

      setHouseguests(houseguestsData)
      setWeeks(weeksData)

      // Load current week data if it exists
      const currentWeek = weeksData.find((w: Week) => w.week === selectedWeek)
      if (currentWeek) {
        setWeekForm({
          hohCompetition: currentWeek.hohCompetition || '',
          hohWinnerId: currentWeek.hohWinnerId || '',
          nominees: currentWeek.nominees || ['', '', ''],
          povCompetition: currentWeek.povCompetition || '',
          povWinnerId: currentWeek.povWinnerId || '',
          povUsed: currentWeek.povUsed || false,
          povRemovedNomineeId: currentWeek.povRemovedNomineeId || '',
          povReplacementId: currentWeek.povReplacementId || '',
          blockbusterCompetition: currentWeek.blockbusterCompetition || '',
          blockbusterWinnerId: currentWeek.blockbusterWinnerId || '',
          evictedNomineeId: currentWeek.evictedNomineeId || '',
          evictionVote: currentWeek.evictionVote || '',
        })
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }, [selectedWeek])

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user?.isAdmin) {
      router.push('/')
      return
    }

    fetchData()
  }, [session, status, router, fetchData])

  const handleWeekChange = (weekNumber: number) => {
    setSelectedWeek(weekNumber)
    const week = weeks.find(w => w.week === weekNumber)
    if (week) {
      setWeekForm({
        hohCompetition: week.hohCompetition || '',
        hohWinnerId: week.hohWinnerId || '',
        nominees: week.nominees || ['', '', ''],
        povCompetition: week.povCompetition || '',
        povWinnerId: week.povWinnerId || '',
        povUsed: week.povUsed || false,
        povRemovedNomineeId: week.povRemovedNomineeId || '',
        povReplacementId: week.povReplacementId || '',
        blockbusterCompetition: week.blockbusterCompetition || '',
        blockbusterWinnerId: week.blockbusterWinnerId || '',
        evictedNomineeId: week.evictedNomineeId || '',
        evictionVote: week.evictionVote || '',
      })
    } else {
      setWeekForm({
        hohCompetition: '',
        hohWinnerId: '',
        nominees: ['', '', ''],
        povCompetition: '',
        povWinnerId: '',
        povUsed: false,
        povRemovedNomineeId: '',
        povReplacementId: '',
        blockbusterCompetition: '',
        blockbusterWinnerId: '',
        evictedNomineeId: '',
        evictionVote: '',
      })
    }
  }

  const saveWeek = async () => {
    try {
      setSaving(true)
      const response = await fetch(`/api/admin/week/${selectedWeek}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hohCompetition: weekForm.hohCompetition || null,
          hohWinnerId: weekForm.hohWinnerId || null,
          nominees: weekForm.nominees.filter(n => n),
          povCompetition: weekForm.povCompetition || null,
          povWinnerId: weekForm.povWinnerId || null,
          povUsed: weekForm.povUsed,
          povRemovedNomineeId: weekForm.povRemovedNomineeId || null,
          povReplacementId: weekForm.povReplacementId || null,
          blockbusterCompetition: weekForm.blockbusterCompetition || null,
          blockbusterWinnerId: weekForm.blockbusterWinnerId || null,
          evictedNomineeId: weekForm.evictedNomineeId || null,
          evictionVote: weekForm.evictionVote || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save week')
      }

      toast.success('Week saved successfully!')
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error saving week:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save week')
    } finally {
      setSaving(false)
    }
  }

  const saveHouseguest = async () => {
    if (!selectedHouseguest) {
      toast.error('Please select a houseguest')
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/admin/houseguest/${selectedHouseguest}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: houseguestForm.bio || null,
          photoUrl: houseguestForm.photoUrl || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save houseguest')
      }

      toast.success('Houseguest updated successfully!')
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error saving houseguest:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save houseguest')
    } finally {
      setSaving(false)
    }
  }

  const seedHouseguests = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/houseguests/seed', {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to seed houseguests')
      }

      const result = await response.json()
      toast.success(result.message)
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error seeding houseguests:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to seed houseguests')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin panel...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Manage season data and houseguest information
          </p>
        </div>

        <Tabs defaultValue="week-editor" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week-editor" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Week Editor
            </TabsTrigger>
            <TabsTrigger value="houseguests" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Houseguests
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="week-editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Week {selectedWeek} Editor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Week Selector */}
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(week => (
                    <Button
                      key={week}
                      variant={selectedWeek === week ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleWeekChange(week)}
                    >
                      Week {week}
                    </Button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* HOH Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="w-5 h-5 text-yellow-600" />
                        Head of Household
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="hohCompetition">Competition Name</Label>
                        <Input
                          id="hohCompetition"
                          value={weekForm.hohCompetition}
                          onChange={(e) => setWeekForm(prev => ({ ...prev, hohCompetition: e.target.value }))}
                          placeholder="e.g., Safety First"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hohWinner">Winner</Label>
                        <Select
                          value={weekForm.hohWinnerId}
                          onValueChange={(value) => setWeekForm(prev => ({ ...prev, hohWinnerId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select HOH winner" />
                          </SelectTrigger>
                          <SelectContent>
                            {houseguests.map(hg => (
                              <SelectItem key={hg.id} value={hg.id}>
                                {hg.firstName} {hg.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Nominees Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="w-5 h-5 text-red-600" />
                        Nominees (3)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {weekForm.nominees.map((nomineeId, index) => (
                        <div key={index}>
                          <Label htmlFor={`nominee-${index}`}>Nominee {index + 1}</Label>
                          <Select
                            value={nomineeId}
                            onValueChange={(value) => {
                              const newNominees = [...weekForm.nominees]
                              newNominees[index] = value
                              setWeekForm(prev => ({ ...prev, nominees: newNominees }))
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select nominee ${index + 1}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {houseguests.map(hg => (
                                <SelectItem key={hg.id} value={hg.id}>
                                  {hg.firstName} {hg.lastName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* POV Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Power of Veto
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="povCompetition">Competition Name</Label>
                        <Input
                          id="povCompetition"
                          value={weekForm.povCompetition}
                          onChange={(e) => setWeekForm(prev => ({ ...prev, povCompetition: e.target.value }))}
                          placeholder="e.g., Veto Battle"
                        />
                      </div>
                      <div>
                        <Label htmlFor="povWinner">Winner</Label>
                        <Select
                          value={weekForm.povWinnerId}
                          onValueChange={(value) => setWeekForm(prev => ({ ...prev, povWinnerId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select POV winner" />
                          </SelectTrigger>
                          <SelectContent>
                            {houseguests.map(hg => (
                              <SelectItem key={hg.id} value={hg.id}>
                                {hg.firstName} {hg.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="povUsed"
                          checked={weekForm.povUsed}
                          onCheckedChange={(checked) => setWeekForm(prev => ({ ...prev, povUsed: checked }))}
                        />
                        <Label htmlFor="povUsed">POV Used</Label>
                      </div>
                      {weekForm.povUsed && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="povRemoved">Removed Nominee</Label>
                            <Select
                              value={weekForm.povRemovedNomineeId}
                              onValueChange={(value) => setWeekForm(prev => ({ ...prev, povRemovedNomineeId: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select removed nominee" />
                              </SelectTrigger>
                              <SelectContent>
                                {weekForm.nominees.filter(n => n).map(nomineeId => {
                                  const hg = houseguests.find(h => h.id === nomineeId)
                                  return hg ? (
                                    <SelectItem key={hg.id} value={hg.id}>
                                      {hg.firstName} {hg.lastName}
                                    </SelectItem>
                                  ) : null
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="povReplacement">Replacement Nominee</Label>
                            <Select
                              value={weekForm.povReplacementId}
                              onValueChange={(value) => setWeekForm(prev => ({ ...prev, povReplacementId: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select replacement nominee" />
                              </SelectTrigger>
                              <SelectContent>
                                {houseguests.map(hg => (
                                  <SelectItem key={hg.id} value={hg.id}>
                                    {hg.firstName} {hg.lastName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Blockbuster Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield className="w-5 h-5 text-purple-600" />
                        BB Blockbuster
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="blockbusterCompetition">Competition Name</Label>
                        <Input
                          id="blockbusterCompetition"
                          value={weekForm.blockbusterCompetition}
                          onChange={(e) => setWeekForm(prev => ({ ...prev, blockbusterCompetition: e.target.value }))}
                          placeholder="e.g., Blockbuster Battle"
                        />
                      </div>
                      <div>
                        <Label htmlFor="blockbusterWinner">Winner</Label>
                        <Select
                          value={weekForm.blockbusterWinnerId}
                          onValueChange={(value) => setWeekForm(prev => ({ ...prev, blockbusterWinnerId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Blockbuster winner" />
                          </SelectTrigger>
                          <SelectContent>
                            {houseguests.map(hg => (
                              <SelectItem key={hg.id} value={hg.id}>
                                {hg.firstName} {hg.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Eviction Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="w-5 h-5 text-red-600" />
                        Eviction
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="evictedNominee">Evicted Houseguest</Label>
                        <Select
                          value={weekForm.evictedNomineeId}
                          onValueChange={(value) => setWeekForm(prev => ({ ...prev, evictedNomineeId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select evicted houseguest" />
                          </SelectTrigger>
                          <SelectContent>
                            {weekForm.nominees.filter(n => n).map(nomineeId => {
                              const hg = houseguests.find(h => h.id === nomineeId)
                              return hg ? (
                                <SelectItem key={hg.id} value={hg.id}>
                                  {hg.firstName} {hg.lastName}
                                </SelectItem>
                              ) : null
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="evictionVote">Vote Result</Label>
                        <Input
                          id="evictionVote"
                          value={weekForm.evictionVote}
                          onChange={(e) => setWeekForm(prev => ({ ...prev, evictionVote: e.target.value }))}
                          placeholder="e.g., 8-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveWeek} disabled={saving} size="lg">
                    {saving ? 'Saving...' : 'Save Week'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="houseguests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Houseguest Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="houseguestSelect">Select Houseguest</Label>
                    <Select
                      value={selectedHouseguest}
                      onValueChange={(value) => {
                        setSelectedHouseguest(value)
                        const hg = houseguests.find(h => h.id === value)
                        if (hg) {
                          setHouseguestForm({
                            bio: hg.bio || '',
                            photoUrl: hg.photoUrl || '',
                          })
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a houseguest" />
                      </SelectTrigger>
                      <SelectContent>
                        {houseguests.map(hg => (
                          <SelectItem key={hg.id} value={hg.id}>
                            {hg.firstName} {hg.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedHouseguest && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={houseguestForm.bio}
                          onChange={(e) => setHouseguestForm(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Enter houseguest bio..."
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="photoUrl">Photo URL</Label>
                        <Input
                          id="photoUrl"
                          value={houseguestForm.photoUrl}
                          onChange={(e) => setHouseguestForm(prev => ({ ...prev, photoUrl: e.target.value }))}
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                      <Button onClick={saveHouseguest} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Houseguests List */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">All Houseguests</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {houseguests.map(hg => (
                      <Card key={hg.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{hg.firstName} {hg.lastName}</h4>
                            <Badge variant={hg.status === 'IN' ? 'default' : 'secondary'}>
                              {hg.status}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedHouseguest(hg.id)
                              setHouseguestForm({
                                bio: hg.bio || '',
                                photoUrl: hg.photoUrl || '',
                              })
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Admin Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Database Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Seed Houseguests</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Initialize the database with all Season 27 houseguests.
                        </p>
                        <Button onClick={seedHouseguests} disabled={saving}>
                          {saving ? 'Seeding...' : 'Seed Houseguests'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
