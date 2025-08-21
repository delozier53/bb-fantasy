import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { withRateLimit } from '@/lib/rate-limit'

const updatePicksSchema = z.object({
  picks: z.array(z.string()).length(5, 'Must select exactly 5 houseguests'),
})

async function handlePOST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { picks } = updatePicksSchema.parse(body)

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify all houseguest IDs exist
    const houseguests = await prisma.houseguest.findMany({
      where: { id: { in: picks } },
    })

    if (houseguests.length !== 5) {
      return NextResponse.json(
        { error: 'One or more houseguest IDs are invalid' },
        { status: 400 }
      )
    }

    // Verify no duplicate picks
    const uniquePicks = new Set(picks)
    if (uniquePicks.size !== 5) {
      return NextResponse.json(
        { error: 'Cannot select the same houseguest multiple times' },
        { status: 400 }
      )
    }

    // Delete existing picks and create new ones in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete existing picks
      await tx.pick.deleteMany({
        where: { userId: user.id },
      })

      // Create new picks
      await tx.pick.createMany({
        data: picks.map(houseguestId => ({
          userId: user.id,
          houseguestId,
        })),
      })
    })

    return NextResponse.json({ 
      message: 'Picks updated successfully',
      picks 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating picks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, handlePOST, { limit: 3, window: 60 })
}
