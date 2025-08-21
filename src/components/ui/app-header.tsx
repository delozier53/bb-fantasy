"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/': 'BB Fantasy',
  '/houseguests': 'Houseguests',
  '/leaderboard': 'Leaderboard',
  '/history': 'History',
  '/welcome': 'Profile',
}

export function AppHeader() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || 'BB Fantasy'

  // Hide header on houseguests page since it has its own title
  if (pathname === '/houseguests') {
    return null
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 safe-top">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">BB</span>
          </div>
          <h1 className="font-bold text-lg navy-text">{title}</h1>
        </div>
        
        {/* Right side actions - can be expanded later */}
        <div className="flex items-center space-x-2">
          {pathname === '/' && (
            <Link 
              href="/welcome"
              className="px-3 py-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              Join
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
