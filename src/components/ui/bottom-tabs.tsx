"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Trophy, Clock } from 'lucide-react'

const tabs = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Houseguests',
    href: '/houseguests',
    icon: Users,
  },
  {
    name: 'Leaderboard',
    href: '/leaderboard',
    icon: Trophy,
  },
  {
    name: 'History',
    href: '/history',
    icon: Clock,
  },
]

export function BottomTabs() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = tab.icon
          
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full py-2 px-1 transition-all duration-200 ${
                isActive
                  ? 'text-amber-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon 
                className={`w-5 h-5 mb-1 transition-all duration-200 ${
                  isActive ? 'scale-110' : ''
                }`} 
              />
              <span className={`text-xs font-medium transition-all duration-200 ${
                isActive ? 'scale-105' : ''
              }`}>
                {tab.name}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-amber-500 rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
