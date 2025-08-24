import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
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
    // Use our custom session system instead of NextAuth
    const sessionToken = request.cookies.get('next-auth.session-token')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get the session and user
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('sessionToken', sessionToken)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user to check if admin
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.userId)
      .single()

    if (userError || !user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = params
    const body = await request.json()
    const updateData = updateHouseguestSchema.parse(body)

    // Check if houseguest exists
    const { data: existingHouseguest, error: existingError } = await supabase
      .from('houseguests')
      .select('*')
      .eq('id', id)
      .single()

    if (existingError || !existingHouseguest) {
      return NextResponse.json({ error: 'Houseguest not found' }, { status: 404 })
    }

    // Update the houseguest
    const { data: updatedHouseguest, error: updateError } = await supabase
      .from('houseguests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating houseguest:', updateError)
      return NextResponse.json({ error: 'Failed to update houseguest' }, { status: 500 })
    }

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
