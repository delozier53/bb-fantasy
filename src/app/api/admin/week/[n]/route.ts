import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateWeekSchema = z.object({
  hohCompetition: z.string().optional(),
  hohWinnerId: z.string().uuid().optional().nullable(),
  nominees: z.array(z.string().uuid()).length(3).optional(),
  povCompetition: z.string().optional(),
  povWinnerId: z.string().uuid().optional().nullable(),
  povUsed: z.boolean().optional().nullable(),
  povRemovedNomineeId: z.string().uuid().optional().nullable(),
  povReplacementId: z.string().uuid().optional().nullable(),
  blockbusterCompetition: z.string().optional(),
  blockbusterWinnerId: z.string().uuid().optional().nullable(),
  evictedNomineeId: z.string().uuid().optional().nullable(),
  evictionVote: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { n: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const weekNumber = parseInt(params.n)
    if (isNaN(weekNumber) || weekNumber < 1) {
      return NextResponse.json({ error: 'Invalid week number' }, { status: 400 })
    }

    const body = await request.json()
    const updateData = updateWeekSchema.parse(body)

    // Validate POV logic
    if (updateData.povUsed === true) {
      if (!updateData.povRemovedNomineeId || !updateData.povReplacementId) {
        return NextResponse.json(
          { error: 'POV removal and replacement must be specified when POV is used' },
          { status: 400 }
        )
      }
    }

    // Validate eviction nominee is one of the nominees
    if (updateData.evictedNomineeId && updateData.nominees) {
      if (!updateData.nominees.includes(updateData.evictedNomineeId)) {
        return NextResponse.json(
          { error: 'Evicted nominee must be one of the nominees' },
          { status: 400 }
        )
      }
    }

    // Create or update the week
    const week = await prisma.week.upsert({
      where: { week: weekNumber },
      update: updateData,
      create: {
        week: weekNumber,
        ...updateData,
      },
    })

    // If there's an eviction, update the houseguest status
    if (updateData.evictedNomineeId) {
      await prisma.houseguest.update({
        where: { id: updateData.evictedNomineeId },
        data: {
          status: 'EVICTED',
          evictionWeek: weekNumber,
          evictionVote: updateData.evictionVote || null,
        },
      })
    }

    // Update houseguest win records
    if (updateData.hohWinnerId) {
      await prisma.houseguest.update({
        where: { id: updateData.hohWinnerId },
        data: {
          hohWins: {
            push: weekNumber,
          },
        },
      })
    }

    if (updateData.povWinnerId) {
      await prisma.houseguest.update({
        where: { id: updateData.povWinnerId },
        data: {
          povWins: {
            push: weekNumber,
          },
        },
      })
    }

    if (updateData.blockbusterWinnerId) {
      await prisma.houseguest.update({
        where: { id: updateData.blockbusterWinnerId },
        data: {
          blockbusterWins: {
            push: weekNumber,
          },
        },
      })
    }

    // Update on-the-block weeks for nominees
    if (updateData.nominees) {
      for (const nomineeId of updateData.nominees) {
        if (nomineeId) {
          await prisma.houseguest.update({
            where: { id: nomineeId },
            data: {
              onTheBlockWeeks: {
                push: weekNumber,
              },
            },
          })
        }
      }
    }

    return NextResponse.json({
      message: 'Week updated successfully',
      week: {
        week: week.week,
        updatedAt: week.updatedAt,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating week:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
