import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all users with their picks and calculate points
    const users = await prisma.user.findMany({
      include: {
        picks: {
          include: {
            Houseguest: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Calculate leaderboard data
    const leaderboardData = users
      .filter(user => user.picks.length > 0) // Only include users who have made picks
      .map(user => {
        let totalPoints = 0
        let remainingCount = 0

        user.picks.forEach(pick => {
          const hg = pick.Houseguest
          // Calculate points: 2 points per competition win
          const points = 2 * (hg.hohWins.length + hg.povWins.length + hg.blockbusterWins.length)
          totalPoints += points

          // Count remaining houseguests
          if (hg.status === 'IN') {
            remainingCount += 1
          }
        })

        return {
          id: user.id,
          username: user.username,
          photoUrl: user.photoUrl,
          totalPoints,
          remainingCount,
        }
      })
      .sort((a, b) => {
        // Sort by total points descending, then by remaining count descending
        if (b.totalPoints !== a.totalPoints) {
          return b.totalPoints - a.totalPoints
        }
        return b.remainingCount - a.remainingCount
      })

    return NextResponse.json(leaderboardData)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
