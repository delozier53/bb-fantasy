import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const desc = searchParams.get('desc') === '1'

    const weeks = await prisma.week.findMany({
      include: {
        hohWinner: true,
        povWinner: true,
        blockbusterWinner: true,
        povRemovedNominee: true,
        povReplacement: true,
        evictedNominee: true,
      },
      orderBy: {
        week: desc ? 'desc' : 'asc',
      },
    })

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
      updatedAt: week.updatedAt.toISOString(),
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
