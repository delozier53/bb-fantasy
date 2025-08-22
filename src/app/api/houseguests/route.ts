import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: houseguests, error } = await supabase
      .from('houseguests')
      .select('*')
      .order('status', { ascending: true }) // IN first, then EVICTED
      .order('firstName', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch houseguests' },
        { status: 500 }
      )
    }

    // Transform the data to match our frontend types
    const transformedHouseguests = houseguests.map(hg => ({
      id: hg.id,
      slug: hg.slug,
      firstName: hg.firstName,
      lastName: hg.lastName,
      photoUrl: hg.photoUrl,
      bio: hg.bio,
      status: hg.status,
      eviction: hg.evictionWeek && hg.evictionVote ? {
        week: hg.evictionWeek,
        vote: hg.evictionVote,
      } : null,
      onTheBlockWeeks: hg.onTheBlockWeeks || [],
      wins: {
        hoh: hg.hohWins || [],
        pov: hg.povWins || [],
        blockbuster: hg.blockbusterWins || [],
      },
    }))

    return NextResponse.json(transformedHouseguests)
  } catch (error) {
    console.error('Error fetching houseguests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
