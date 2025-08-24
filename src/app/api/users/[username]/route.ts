import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get the user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get the user's picks with houseguest data
    const { data: picks, error: picksError } = await supabase
      .from('picks')
      .select(`
        houseguestId,
        houseguests (
          id,
          slug,
          firstName,
          lastName,
          photoUrl,
          bio,
          status,
          evictionWeek,
          evictionVote,
          onTheBlockWeeks,
          hohWins,
          povWins,
          blockbusterWins
        )
      `)
      .eq('userId', user.id)

    if (picksError) {
      console.error('Error fetching picks:', picksError)
      return NextResponse.json(
        { error: 'Failed to fetch user picks' },
        { status: 500 }
      )
    }

    // Get all weeks data to calculate accurate houseguest information
    const { data: weeks, error: weeksError } = await supabase
      .from('weeks')
      .select('*')
      .order('week', { ascending: true })

    if (weeksError) {
      console.error('Error fetching weeks:', weeksError)
      return NextResponse.json(
        { error: 'Failed to fetch game data' },
        { status: 500 }
      )
    }

    const currentWeek = weeks.length

    if (picksError) {
      console.error('Error fetching picks:', picksError)
      return NextResponse.json(
        { error: 'Failed to fetch user picks' },
        { status: 500 }
      )
    }

    // Transform the data to match our frontend types with accurate game information
    const houseguests = picks.map(pick => {
      const hg = pick.houseguests
      
      // Calculate wins from weeks data
      const hohWins: number[] = []
      const povWins: number[] = []
      const blockbusterWins: number[] = []
      const onTheBlockWeeks: number[] = []
      
      weeks.forEach(week => {
        // Check HOH wins
        if (week.hohWinnerId === hg.id) {
          hohWins.push(week.week)
        }
        
        // Check POV wins
        if (week.povWinnerId === hg.id) {
          povWins.push(week.week)
        }
        
        // Check Blockbuster wins
        if (week.blockbusterWinnerId === hg.id) {
          blockbusterWins.push(week.week)
        }
        
        // Check if nominated
        if (week.nominees && week.nominees.includes(hg.id)) {
          onTheBlockWeeks.push(week.week)
        }
      })
      
      // Find eviction information
      const evictionWeek = weeks.find(week => week.evictedNomineeId === hg.id)
      const eviction = evictionWeek ? {
        week: evictionWeek.week,
        vote: evictionWeek.evictionVote || '',
      } : null
      
      // Determine current status
      let currentStatus = hg.status
      if (eviction && eviction.week <= currentWeek) {
        currentStatus = 'EVICTED'
      }
      
      return {
        id: hg.id,
        slug: hg.slug,
        firstName: hg.firstName,
        lastName: hg.lastName,
        photoUrl: hg.photoUrl,
        bio: hg.bio,
        status: currentStatus,
        eviction,
        onTheBlockWeeks,
        wins: {
          hoh: hohWins,
          pov: povWins,
          blockbuster: blockbusterWins,
        },
      }
    })

    // Calculate total points using the same logic as the frontend
    const totalPoints = houseguests.reduce((total, hg) => {
      // Competition wins
      const hohPoints = hg.wins.hoh.length * 5  // 5 points per HOH win
      const povPoints = hg.wins.pov.length * 3  // 3 points per POV win
      const blockbusterPoints = hg.wins.blockbuster.length * 3  // 3 points per Blockbuster win
      
      // Nomination survival points (1 point for each week nominated but not evicted)
      const nominationSurvivalPoints = hg.onTheBlockWeeks.length * 1
      
      // Weekly survival points (1 point per week survived)
      const totalWeeksSurvived = hg.status === 'EVICTED' 
        ? (hg.eviction?.week || 0) - 1  // Survived until eviction week - 1
        : currentWeek  // Current week (no points for final week)
      
      const weeklySurvivalPoints = totalWeeksSurvived * 1  // 1 point per week survived
      
      return total + hohPoints + povPoints + blockbusterPoints + nominationSurvivalPoints + weeklySurvivalPoints
    }, 0)

    // Count remaining houseguests (those still in the house, not in jury)
    const remainingCount = houseguests.filter(hg => hg.status === 'IN').length

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        photoUrl: user.photoUrl,
        totalPoints,
        remainingCount,
      },
      houseguests,
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
