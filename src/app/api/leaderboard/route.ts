import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get all users with their picks and houseguest data
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        username,
        email,
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
            evictionWeek,
            onTheBlockWeeks,
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
            // Calculate points using the same logic as pointsForHG function
            const hohPoints = (hg.hohWins?.length || 0) * 5  // 5 points per HOH win
            const povPoints = (hg.povWins?.length || 0) * 3  // 3 points per POV win
            const blockbusterPoints = (hg.blockbusterWins?.length || 0) * 3  // 3 points per Blockbuster win
            
            // Nomination survival points (1 point for each week nominated but not evicted)
            const nominationSurvivalPoints = (hg.onTheBlockWeeks?.length || 0) * 1
            
            // Weekly survival points (1 point per week survived)
            const totalWeeksSurvived = hg.status === 'EVICTED' 
              ? (hg.evictionWeek || 0) - 1  // Survived until eviction week - 1
              : 15  // Assuming 15 weeks total (no points for final week)
            
            const weeklySurvivalPoints = totalWeeksSurvived * 1  // 1 point per week survived
            
            const points = hohPoints + povPoints + blockbusterPoints + nominationSurvivalPoints + weeklySurvivalPoints
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
          email: user.email,
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
