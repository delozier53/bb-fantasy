'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Houseguest, pointsForHG } from '@/types'
import { Edit } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface UserTeamPopupProps {
  isOpen: boolean
  onClose: () => void
  username: string
  userPhotoUrl?: string
  onEditProfile?: () => void
}

interface UserTeamData {
  user: {
    id: string
    email: string
    username: string
    photoUrl?: string
    totalPoints: number
    remainingCount: number
  }
  houseguests: Houseguest[]
}

export function UserTeamPopup({ isOpen, onClose, username, userPhotoUrl, onEditProfile }: UserTeamPopupProps) {
  const { data: session } = useSession()
  const [teamData, setTeamData] = useState<UserTeamData | null>(null)
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    if (isOpen && username) {
      fetchUserTeam()
    }
  }, [isOpen, username])

  const fetchUserTeam = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/users/${username}`)
      if (response.ok) {
        const data = await response.json()
        setTeamData(data)
      }
    } catch (error) {
      console.error('Error fetching user team:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (houseguest: Houseguest) => {
    if (houseguest.status === 'IN') {
      return <Badge className="bg-green-500 text-white">In the House</Badge>
    } else if (houseguest.status === 'EVICTED') {
      // Check if they're in jury (assuming jury starts around week 8-9)
      const evictionWeek = houseguest.eviction?.week || 0
      if (evictionWeek >= 8) {
        return <Badge className="bg-purple-500 text-white">In Jury</Badge>
      } else {
        return <Badge className="bg-red-500 text-white">Not in Jury</Badge>
      }
    }
    return <Badge className="bg-gray-500 text-white">Unknown</Badge>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-blue-900 border-blue-700">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={userPhotoUrl} alt={`Profile photo of ${username}`} />
              <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <DialogTitle className="text-white text-xl text-left">{username}'s Team</DialogTitle>
              {teamData && (
                <p className="text-white/80 text-sm">
                  {teamData.user.totalPoints} points • {teamData.user.remainingCount} houseguests still playing
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Edit Profile Button - only show for current user */}
        {(() => {
          console.log('Debug - Session email:', session?.user?.email)
          console.log('Debug - Team data email:', teamData?.user?.email)
          console.log('Debug - onEditProfile exists:', !!onEditProfile)
          console.log('Debug - Should show button:', session?.user?.email === teamData?.user?.email && !!onEditProfile)
          return null
        })()}
        
        {session?.user?.email === teamData?.user?.email && onEditProfile && (
          <div className="mb-4">
            <Button
              onClick={onEditProfile}
              className="bg-amber-500 hover:bg-amber-600 text-white"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-white/80">Loading team...</p>
          </div>
        ) : teamData ? (
          <div className="space-y-4">
            {teamData.houseguests.map((houseguest) => {
              const points = pointsForHG(houseguest)
              
              return (
                <div
                  key={houseguest.id}
                  className="flex items-center gap-3 p-3 bg-blue-800/50 rounded-lg border border-blue-700/30"
                >
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage 
                      src={houseguest.photoUrl} 
                      alt={`Photo of ${houseguest.firstName} ${houseguest.lastName}`}
                    />
                    <AvatarFallback className="text-sm">
                      {houseguest.firstName[0]}{houseguest.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-base mb-1">
                      {houseguest.firstName}
                    </h3>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(houseguest)}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">
                      {points}
                    </div>
                    <div className="text-xs text-white/80">points</div>
                  </div>
                </div>
              )
            })}
            
            {teamData.houseguests.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/80">This user hasn't made their picks yet.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/80">Failed to load team data.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
