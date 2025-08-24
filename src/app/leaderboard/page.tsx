'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Award, Search, Edit } from 'lucide-react'
import { LeaderboardRowSkeleton } from '@/components/ui/skeleton'
import { LeaderboardEntry } from '@/types'
import { UserTeamPopup } from '@/components/ui/user-team-popup'
import { PointValuesPopup } from '@/components/ui/point-values-popup'
import { EditProfilePopup } from '@/components/ui/edit-profile-popup'
import { useSession } from 'next-auth/react'

export default function LeaderboardPage() {
  const { data: session } = useSession()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isPointValuesOpen, setIsPointValuesOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)



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
        return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-white">{rank}</span>
    }
  }

  const handleUserClick = (user: LeaderboardEntry) => {
    setSelectedUser(user)
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
    setSelectedUser(null)
  }

  const handlePointValuesClick = () => {
    setIsPointValuesOpen(true)
  }

  const handleClosePointValues = () => {
    setIsPointValuesOpen(false)
  }

  const handleEditProfile = () => {
    setIsEditProfileOpen(true)
  }

  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false)
  }

  const handleSaveProfile = async (username: string, photoFile?: File) => {
    try {
      const formData = new FormData()
      formData.append('username', username)
      if (photoFile) {
        formData.append('photo', photoFile)
      }

      const response = await fetch('/api/me', {
        method: 'PUT',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      // Refresh the leaderboard to show updated data
      const leaderboardResponse = await fetch('/api/leaderboard')
      if (leaderboardResponse.ok) {
        const data = await leaderboardResponse.json()
        setLeaderboard(data)
        setFilteredLeaderboard(data)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen navy-gradient">
        <div className="px-4 py-6">
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
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          {/* App Logo */}
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.svg" 
              alt="Big Brother Fantasy League Logo" 
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-6">
            Leaderboard
          </h1>
          
          {/* Search Box and Point Values Button */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={handlePointValuesClick}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Point Values
            </button>
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
            <Card className="navy-card">
              <CardContent>
                <div className="space-y-3">
                  {filteredLeaderboard.map((entry, index) => {
                    const rank = index + 1
                    

                    
                    return (
                      <div
                        key={entry.username}
                        className="flex items-center justify-between p-4 bg-blue-900/90 rounded-lg border border-blue-700/30 hover:bg-blue-800/90 transition-all cursor-pointer"
                        onClick={() => handleUserClick(entry)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center">
                            {getRankIcon(rank)}
                          </div>
                          
                          <Avatar className="w-12 h-12 hover:ring-2 hover:ring-amber-300 transition-all">
                            <AvatarImage 
                              src={entry.photoUrl || undefined} 
                              alt={`Profile photo of ${entry.username}`}
                            />
                            <AvatarFallback>
                              {entry.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="font-semibold text-lg text-white hover:text-amber-400 transition-colors">
                              {entry.username}
                            </div>
                            <p className="text-sm text-white">
                              {entry.remainingCount} houseguests remaining
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {entry.totalPoints}
                          </div>
                          <div className="text-sm text-white">points</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>


          </div>
        )}
      </div>

      {/* User Team Popup */}
      {selectedUser && (
        <UserTeamPopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          username={selectedUser.username}
          userPhotoUrl={selectedUser.photoUrl}
          onEditProfile={handleEditProfile}
        />
      )}

      {/* Point Values Popup */}
      <PointValuesPopup
        isOpen={isPointValuesOpen}
        onClose={handleClosePointValues}
      />

      {/* Edit Profile Popup */}
      {session?.user && (
        <EditProfilePopup
          isOpen={isEditProfileOpen}
          onClose={handleCloseEditProfile}
          currentUsername={session.user.name || ''}
          currentPhotoUrl={session.user.image || undefined}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  )
}
