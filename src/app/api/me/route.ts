import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createUserSchema = z.object({
  username: z.string().min(3).max(20),
  photoUrl: z.string().url().nullable().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { username, photoUrl } = createUserSchema.parse(body)

    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser && existingUser.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      )
    }

    // Create or update user
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {
        username,
        photoUrl,
      },
      create: {
        email: session.user.email,
        username,
        photoUrl,
      },
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      photoUrl: user.photoUrl,
      isAdmin: user.isAdmin,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating/updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        picks: {
          include: {
            Houseguest: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      photoUrl: user.photoUrl,
      isAdmin: user.isAdmin,
      picks: user.picks.map(pick => pick.houseguestId),
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
