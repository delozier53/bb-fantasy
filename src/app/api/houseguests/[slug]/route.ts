import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Fetch houseguest
    const { data: houseguest, error: houseguestError } = await supabase
      .from('houseguests')
      .select('*')
      .eq('slug', slug)
      .single()

    if (houseguestError) {
      if (houseguestError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Houseguest not found' },
          { status: 404 }
        )
      }
      console.error('Supabase error fetching houseguest:', houseguestError)
      return NextResponse.json(
        { error: 'Failed to fetch houseguest' },
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

    // Calculate stats based on weeks data
    const hohWins: number[] = []
    const povWins: number[] = []
    const blockbusterWins: number[] = []
    const onTheBlockWeeks: number[] = []
    let evictionWeek: number | null = null
    let evictionVote: string | null = null

    // Process each week to calculate stats
    weeks.forEach(week => {
      // Check HOH wins
      if (week.hohWinnerId === houseguest.id) {
        hohWins.push(week.week)
      }

      // Check POV wins
      if (week.povWinnerId === houseguest.id) {
        povWins.push(week.week)
      }

      // Check Blockbuster wins
      if (week.blockbusterWinnerId === houseguest.id) {
        blockbusterWins.push(week.week)
      }

      // Check if nominated (in nominees array)
      if (week.nominees && week.nominees.includes(houseguest.id)) {
        onTheBlockWeeks.push(week.week)
      }

      // Check if evicted
      if (week.evictedNomineeId === houseguest.id) {
        evictionWeek = week.week
        evictionVote = week.evictionVote
      }
    })

    // Determine status based on eviction data
    let status = houseguest.status
    if (evictionWeek && evictionVote) {
      status = 'EVICTED'
    }

    // Transform the data to match our frontend types
    const transformedHouseguest = {
      id: houseguest.id,
      slug: houseguest.slug,
      firstName: houseguest.firstName,
      lastName: houseguest.lastName,
      photoUrl: houseguest.photoUrl,
      bio: houseguest.bio,
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
      finalPlacement: houseguest.finalPlacement,
    }

    return NextResponse.json(transformedHouseguest)
  } catch (error) {
    console.error('Error fetching houseguest:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
