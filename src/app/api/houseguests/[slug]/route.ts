import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const houseguest = await prisma.houseguest.findUnique({
      where: { slug },
    })

    if (!houseguest) {
      return NextResponse.json(
        { error: 'Houseguest not found' },
        { status: 404 }
      )
    }

    // Transform the data to match our frontend types
    const transformedHouseguest = {
      id: houseguest.id,
      slug: houseguest.slug,
      firstName: houseguest.firstName,
      lastName: houseguest.lastName,
      photoUrl: houseguest.photoUrl,
      bio: houseguest.bio,
      status: houseguest.status,
      eviction: houseguest.evictionWeek && houseguest.evictionVote ? {
        week: houseguest.evictionWeek,
        vote: houseguest.evictionVote,
      } : null,
      onTheBlockWeeks: houseguest.onTheBlockWeeks,
      wins: {
        hoh: houseguest.hohWins,
        pov: houseguest.povWins,
        blockbuster: houseguest.blockbusterWins,
      },
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
