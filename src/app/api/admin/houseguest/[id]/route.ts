import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateHouseguestSchema = z.object({
  bio: z.string().optional(),
  status: z.enum(['IN', 'EVICTED']).optional(),
  evictionWeek: z.number().optional().nullable(),
  evictionVote: z.string().optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const updateData = updateHouseguestSchema.parse(body)

    // Check if houseguest exists
    const existingHouseguest = await prisma.houseguest.findUnique({
      where: { id },
    })

    if (!existingHouseguest) {
      return NextResponse.json({ error: 'Houseguest not found' }, { status: 404 })
    }

    // Update the houseguest
    const updatedHouseguest = await prisma.houseguest.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      message: 'Houseguest updated successfully',
      houseguest: {
        id: updatedHouseguest.id,
        slug: updatedHouseguest.slug,
        firstName: updatedHouseguest.firstName,
        lastName: updatedHouseguest.lastName,
        bio: updatedHouseguest.bio,
        status: updatedHouseguest.status,
        evictionWeek: updatedHouseguest.evictionWeek,
        evictionVote: updatedHouseguest.evictionVote,
        photoUrl: updatedHouseguest.photoUrl,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating houseguest:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
