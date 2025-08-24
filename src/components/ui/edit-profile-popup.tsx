'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Edit, Upload, X } from 'lucide-react'

interface EditProfilePopupProps {
  isOpen: boolean
  onClose: () => void
  currentUsername: string
  currentPhotoUrl?: string
  onSave: (username: string, photoFile?: File) => Promise<void>
}

export function EditProfilePopup({ 
  isOpen, 
  onClose, 
  currentUsername, 
  currentPhotoUrl, 
  onSave 
}: EditProfilePopupProps) {
  const [username, setUsername] = useState(currentUsername)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSave = async () => {
    if (!username.trim()) {
      setError('Username is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onSave(username.trim(), photoFile || undefined)
      onClose()
    } catch (error) {
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setUsername(currentUsername)
    setPhotoFile(null)
    setPreviewUrl(null)
    setError(null)
    onClose()
  }

  const displayPhotoUrl = previewUrl || currentPhotoUrl

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl font-bold text-center">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Photo Upload */}
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar className="w-20 h-20 ring-4 ring-amber-200">
                <AvatarImage 
                  src={displayPhotoUrl || undefined} 
                  alt="Profile photo"
                />
                <AvatarFallback className="text-lg bg-amber-100 text-amber-800">
                  {username[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-2 transition-colors"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <p className="text-sm text-gray-600 mt-2">
              Click the upload button to change your photo
            </p>
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-700 font-medium">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full"
            />
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
