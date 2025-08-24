'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Week, Houseguest } from '@/types'

interface EditWeekPopupProps {
  isOpen: boolean
  onClose: () => void
  week: Week | null
  houseguests: Houseguest[]
  onSave: (weekData: Partial<Week>) => Promise<void>
}

export function EditWeekPopup({
  isOpen,
  onClose,
  week,
  houseguests,
  onSave
}: EditWeekPopupProps) {
  const [formData, setFormData] = useState<Partial<Week>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (week) {
      setFormData({
        hohCompetition: week.hohCompetition || '',
        hohWinnerId: week.hohWinnerId || '',
        nominees: week.nominees || [],
        povCompetition: week.povCompetition || '',
        povWinnerId: week.povWinnerId || '',
        povUsed: week.povUsed,
        povRemovedNomineeId: week.povRemovedNomineeId || '',
        povReplacementId: week.povReplacementId || '',
        blockbusterCompetition: week.blockbusterCompetition || '',
        blockbusterWinnerId: week.blockbusterWinnerId || '',
        evictedNomineeId: week.evictedNomineeId || '',
        evictionVote: week.evictionVote || ''
      })
    }
  }, [week])

  const handleSave = async () => {
    if (!week) return

    setLoading(true)
    setError(null)

    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      setError('Failed to update week data')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({})
    setError(null)
    onClose()
  }

  // Ensure houseguests is an array
  const safeHouseguests = Array.isArray(houseguests) ? houseguests : []

  const getHouseguestName = (id: string) => {
    const hg = safeHouseguests.find(h => h.id === id)
    return hg ? `${hg.firstName} ${hg.lastName}` : 'Unknown'
  }

  if (!week) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl font-bold text-center">
            Edit Week {week.week}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* HOH Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Head of Household</h3>
            
            <div className="space-y-2">
              <Label htmlFor="hohCompetition">HOH Competition</Label>
              <Textarea
                id="hohCompetition"
                value={formData.hohCompetition || ''}
                onChange={(e) => setFormData({ ...formData, hohCompetition: e.target.value })}
                placeholder="Describe the HOH competition..."
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hohWinner">HOH Winner</Label>
              <Select
                value={formData.hohWinnerId || ''}
                onValueChange={(value) => setFormData({ ...formData, hohWinnerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select HOH winner" />
                </SelectTrigger>
                <SelectContent className="!bg-gray-100">
                  <SelectItem value="">None</SelectItem>
                  {safeHouseguests.map((hg) => (
                    <SelectItem key={hg.id} value={hg.id}>
                      {getHouseguestName(hg.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Nominees Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Nominees</h3>
            
            <div className="space-y-2">
              <Label>Nominee 1</Label>
              <Select
                value={formData.nominees?.[0] || ''}
                onValueChange={(value) => {
                  const nominees = [...(formData.nominees || [])]
                  nominees[0] = value
                  setFormData({ ...formData, nominees })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select first nominee" />
                </SelectTrigger>
                <SelectContent className="!bg-gray-100">
                  <SelectItem value="">None</SelectItem>
                  {safeHouseguests.map((hg) => (
                    <SelectItem key={hg.id} value={hg.id}>
                      {getHouseguestName(hg.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nominee 2</Label>
              <Select
                value={formData.nominees?.[1] || ''}
                onValueChange={(value) => {
                  const nominees = [...(formData.nominees || [])]
                  nominees[1] = value
                  setFormData({ ...formData, nominees })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select second nominee" />
                </SelectTrigger>
                <SelectContent className="!bg-gray-100">
                  <SelectItem value="">None</SelectItem>
                  {safeHouseguests.map((hg) => (
                    <SelectItem key={hg.id} value={hg.id}>
                      {getHouseguestName(hg.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* POV Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Power of Veto</h3>
            
            <div className="space-y-2">
              <Label htmlFor="povCompetition">POV Competition</Label>
              <Textarea
                id="povCompetition"
                value={formData.povCompetition || ''}
                onChange={(e) => setFormData({ ...formData, povCompetition: e.target.value })}
                placeholder="Describe the POV competition..."
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="povWinner">POV Winner</Label>
              <Select
                value={formData.povWinnerId || ''}
                onValueChange={(value) => setFormData({ ...formData, povWinnerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select POV winner" />
                </SelectTrigger>
                <SelectContent className="!bg-gray-100">
                  <SelectItem value="">None</SelectItem>
                  {safeHouseguests.map((hg) => (
                    <SelectItem key={hg.id} value={hg.id}>
                      {getHouseguestName(hg.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="povUsed"
                checked={formData.povUsed || false}
                onCheckedChange={(checked) => setFormData({ ...formData, povUsed: checked })}
              />
              <Label htmlFor="povUsed">POV Used</Label>
            </div>

            {formData.povUsed && (
              <>
                <div className="space-y-2">
                  <Label>Removed Nominee</Label>
                  <Select
                    value={formData.povRemovedNomineeId || ''}
                    onValueChange={(value) => setFormData({ ...formData, povRemovedNomineeId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select removed nominee" />
                    </SelectTrigger>
                    <SelectContent className="!bg-gray-100">
                      <SelectItem value="">None</SelectItem>
                      {formData.nominees?.map((nomineeId) => (
                        <SelectItem key={nomineeId} value={nomineeId}>
                          {getHouseguestName(nomineeId)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Replacement Nominee</Label>
                  <Select
                    value={formData.povReplacementId || ''}
                    onValueChange={(value) => setFormData({ ...formData, povReplacementId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select replacement nominee" />
                    </SelectTrigger>
                    <SelectContent className="!bg-gray-100">
                      <SelectItem value="">None</SelectItem>
                      {safeHouseguests.map((hg) => (
                        <SelectItem key={hg.id} value={hg.id}>
                          {getHouseguestName(hg.id)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          {/* Blockbuster Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">BB Blockbuster</h3>
            
            <div className="space-y-2">
              <Label htmlFor="blockbusterCompetition">Blockbuster Competition</Label>
              <Textarea
                id="blockbusterCompetition"
                value={formData.blockbusterCompetition || ''}
                onChange={(e) => setFormData({ ...formData, blockbusterCompetition: e.target.value })}
                placeholder="Describe the Blockbuster competition..."
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blockbusterWinner">Blockbuster Winner</Label>
              <Select
                value={formData.blockbusterWinnerId || ''}
                onValueChange={(value) => setFormData({ ...formData, blockbusterWinnerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Blockbuster winner" />
                </SelectTrigger>
                <SelectContent className="!bg-gray-100">
                  <SelectItem value="">None</SelectItem>
                  {safeHouseguests.map((hg) => (
                    <SelectItem key={hg.id} value={hg.id}>
                      {getHouseguestName(hg.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Eviction Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Eviction</h3>
            
            <div className="space-y-2">
              <Label htmlFor="evictedNominee">Evicted Houseguest</Label>
              <Select
                value={formData.evictedNomineeId || ''}
                onValueChange={(value) => setFormData({ ...formData, evictedNomineeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select evicted houseguest" />
                </SelectTrigger>
                <SelectContent className="!bg-gray-100">
                  <SelectItem value="">None</SelectItem>
                  {safeHouseguests.map((hg) => (
                    <SelectItem key={hg.id} value={hg.id}>
                      {getHouseguestName(hg.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evictionVote">Eviction Vote</Label>
              <Input
                id="evictionVote"
                value={formData.evictionVote || ''}
                onChange={(e) => setFormData({ ...formData, evictionVote: e.target.value })}
                placeholder="e.g., 8-1, Unanimous, etc."
                className="w-full"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 gold-accent"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
