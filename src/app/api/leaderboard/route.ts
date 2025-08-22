import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get all users with their picks and houseguest data
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        username,
        photoUrl,
        createdAt,
        picks (
          id,
          houseguests (
            id,
            slug,
            firstName,
            lastName,
            status,
            hohWins,
            povWins,
            blockbusterWins
          )
        )
      `)
      .order('createdAt', { ascending: true })

    if (usersError) {
      console.error('Supabase error fetching users:', usersError)
      return NextResponse.json({ error: 'Failed to fetch leaderboard data' }, { status: 500 })
    }

    // Calculate leaderboard data
    const leaderboardData = users
      .filter(user => user.picks && user.picks.length > 0) // Only include users who have made picks
      .map(user => {
        let totalPoints = 0
        let remainingCount = 0

        user.picks.forEach(pick => {
          const hg = pick.houseguests
          if (hg) {
            // Calculate points: 2 points per competition win
            const points = 2 * ((hg.hohWins?.length || 0) + (hg.povWins?.length || 0) + (hg.blockbusterWins?.length || 0))
            totalPoints += points

            // Count remaining houseguests
            if (hg.status === 'IN') {
              remainingCount += 1
            }
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
