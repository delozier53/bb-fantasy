import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Fetch houseguests
    const { data: houseguests, error: houseguestsError } = await supabase
      .from('houseguests')
      .select('*')
      .order('status', { ascending: true }) // IN first, then EVICTED
      .order('firstName', { ascending: true })

    if (houseguestsError) {
      console.error('Supabase error fetching houseguests:', houseguestsError)
      return NextResponse.json(
        { error: 'Failed to fetch houseguests' },
        { status: 500 }
      )
    }

    // Fetch weeks data to calculate stats
    const { data: weeks, error: weeksError } = await supabase
      .from('weeks')
      .select('*')
      .order('week', { ascending: true })

    if (weeksError) {
      console.error('Supabase error fetching weeks:', weeksError)
      return NextResponse.json(
        { error: 'Failed to fetch weeks data' },
        { status: 500 }
      )
    }

    // Calculate stats for each houseguest based on weeks data
    const transformedHouseguests = houseguests.map(hg => {
      const hohWins: number[] = []
      const povWins: number[] = []
      const blockbusterWins: number[] = []
      const onTheBlockWeeks: number[] = []
      let evictionWeek: number | null = null
      let evictionVote: string | null = null

      // Process each week to calculate stats
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

        // Check if nominated (in nominees array)
        if (week.nominees && week.nominees.includes(hg.id)) {
          onTheBlockWeeks.push(week.week)
        }

        // Check if evicted
        if (week.evictedNomineeId === hg.id) {
          evictionWeek = week.week
          evictionVote = week.evictionVote
        }
      })

      // Determine status based on eviction data
      let status = hg.status
      if (evictionWeek && evictionVote) {
        status = 'EVICTED'
      }

      return {
        id: hg.id,
        slug: hg.slug,
        firstName: hg.firstName,
        lastName: hg.lastName,
        photoUrl: hg.photoUrl,
        bio: hg.bio,
        status: status,
        eviction: evictionWeek && evictionVote ? {
          week: evictionWeek,
          vote: evictionVote,
        } : null,
        onTheBlockWeeks,
        wins: {
          hoh: hohWins,
          pov: povWins,
          blockbuster: blockbusterWins,
        },
        finalPlacement: hg.finalPlacement,
      }
    })

    return NextResponse.json(transformedHouseguests)
  } catch (error) {
    console.error('Error fetching houseguests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
