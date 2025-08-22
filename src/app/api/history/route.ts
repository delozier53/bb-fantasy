import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const desc = searchParams.get('desc') === '1'

    const { data: weeks, error } = await supabase
      .from('weeks')
      .select(`
        week,
        hohCompetition,
        hohWinnerId,
        nominees,
        povCompetition,
        povWinnerId,
        povUsed,
        povRemovedNomineeId,
        povReplacementId,
        blockbusterCompetition,
        blockbusterWinnerId,
        evictedNomineeId,
        evictionVote,
        updatedAt,
        hohWinner:houseguests!weeks_hohWinnerId_fkey(*),
        povWinner:houseguests!weeks_povWinnerId_fkey(*),
        blockbusterWinner:houseguests!weeks_blockbusterWinnerId_fkey(*),
        povRemovedNominee:houseguests!weeks_povRemovedNomineeId_fkey(*),
        povReplacement:houseguests!weeks_povReplacementId_fkey(*),
        evictedNominee:houseguests!weeks_evictedNomineeId_fkey(*)
      `)
      .order('week', { ascending: !desc })

    if (error) {
      console.error('Supabase error fetching weeks:', error)
      return NextResponse.json({ error: 'Failed to fetch history data' }, { status: 500 })
    }

    // Transform the data to match our frontend types
    const transformedWeeks = weeks.map(week => ({
      week: week.week,
      hohCompetition: week.hohCompetition,
      hohWinnerId: week.hohWinnerId,
      nominees: week.nominees as [string?, string?, string?],
      povCompetition: week.povCompetition,
      povWinnerId: week.povWinnerId,
      povUsed: week.povUsed,
      povRemovedNomineeId: week.povRemovedNomineeId,
      povReplacementId: week.povReplacementId,
      blockbusterCompetition: week.blockbusterCompetition,
      blockbusterWinnerId: week.blockbusterWinnerId,
      evictedNomineeId: week.evictedNomineeId,
      evictionVote: week.evictionVote,
      updatedAt: week.updatedAt,
    }))

    return NextResponse.json(transformedWeeks)
  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
