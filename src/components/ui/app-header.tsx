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
  // Hide header on all pages
  return null
}
