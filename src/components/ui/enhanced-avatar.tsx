'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-react'

interface EnhancedAvatarProps {
  src?: string | null
  alt: string
  fallbackText?: string
  className?: string
  showIcon?: boolean
}

export function EnhancedAvatar({ 
  src, 
  alt, 
  fallbackText, 
  className, 
  showIcon = false 
}: EnhancedAvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
    setImageError(false)
  }

  return (
    <Avatar className={className}>
      {src && !imageError && (
        <AvatarImage 
          src={src} 
          alt={alt}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-200'}
        />
      )}
      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-200">
        {fallbackText ? (
          <span className="font-medium text-gray-700">
            {fallbackText}
          </span>
        ) : showIcon ? (
          <User className="w-1/2 h-1/2 text-gray-500" />
        ) : (
          <span className="font-medium text-gray-700">?</span>
        )}
      </AvatarFallback>
    </Avatar>
  )
}
