'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Key, CircleSlash, RotateCcw, Heart, Star, Trophy, Medal } from 'lucide-react'

interface PointValuesPopupProps {
  isOpen: boolean
  onClose: () => void
}

const pointValues = [
  {
    icon: <Key className="w-6 h-6 text-yellow-500" />,
    label: "Winning HOH",
    points: "5pts",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200"
  },
  {
    icon: <CircleSlash className="w-6 h-6 text-blue-500" />,
    label: "Winning POV",
    points: "3pts",
    color: "bg-blue-100 text-blue-800 border-blue-200"
  },
  {
    icon: <RotateCcw className="w-6 h-6 text-purple-500" />,
    label: "Winning Block Buster",
    points: "3pts",
    color: "bg-purple-100 text-purple-800 border-purple-200"
  },
  {
    icon: <Heart className="w-6 h-6 text-red-500" />,
    label: "Surviving the Block",
    points: "1pt",
    color: "bg-red-100 text-red-800 border-red-200"
  },
  {
    icon: <Star className="w-6 h-6 text-green-500" />,
    label: "Weekly Survival",
    points: "1-15pts",
    color: "bg-green-100 text-green-800 border-green-200"
  },
  {
    icon: <Medal className="w-6 h-6 text-gray-500" />,
    label: "Runner Up",
    points: "10pts",
    color: "bg-gray-100 text-gray-800 border-gray-200"
  },
  {
    icon: <Trophy className="w-6 h-6 text-amber-500" />,
    label: "Winner",
    points: "25pts",
    color: "bg-amber-100 text-amber-800 border-amber-200"
  }
]

export function PointValuesPopup({ isOpen, onClose }: PointValuesPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl font-bold text-center">
            Point System
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {pointValues.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {item.icon}
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
              <Badge className={item.color}>
                {item.points}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            Points are awarded based on your houseguests' performance throughout the season.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
