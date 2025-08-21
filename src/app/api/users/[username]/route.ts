import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        picks: {
          include: {
            Houseguest: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Transform the data to match our frontend types
    const houseguests = user.picks.map(pick => {
      const hg = pick.Houseguest
      return {
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
        onTheBlockWeeks: hg.onTheBlockWeeks,
        wins: {
          hoh: hg.hohWins,
          pov: hg.povWins,
          blockbuster: hg.blockbusterWins,
        },
      }
    })

    // Calculate total points
    const totalPoints = houseguests.reduce((total, hg) => {
      return total + 2 * (hg.wins.hoh.length + hg.wins.pov.length + hg.wins.blockbuster.length)
    }, 0)

    // Count remaining houseguests
    const remainingCount = houseguests.filter(hg => hg.status === 'IN').length

    return NextResponse.json({
      user: {
        id: user.id,
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
