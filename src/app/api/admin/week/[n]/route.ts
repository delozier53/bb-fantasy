import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withRateLimit } from '@/lib/rate-limit'

async function handlePUT(
  request: NextRequest,
  { params }: { params: Promise<{ n: string }> }
) {
  try {
    const { n } = await params
    const weekNumber = parseInt(n)

    if (isNaN(weekNumber) || weekNumber < 1) {
      return NextResponse.json({ error: 'Invalid week number' }, { status: 400 })
    }

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

    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    // Get the current user and check if they're an admin
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.userId)
      .single()

    if (getUserError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is admin (specifically joshuamdelozier@gmail.com for now)
    if (!user.isAdmin || user.email !== 'joshuamdelozier@gmail.com') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get the request body
    const body = await request.json()

    // Validate the week exists
    const { data: existingWeek, error: weekError } = await supabase
      .from('weeks')
      .select('*')
      .eq('week', weekNumber)
      .single()

    if (weekError || !existingWeek) {
      return NextResponse.json({ error: 'Week not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString()
    }

    // Add fields that are provided in the request
    if (body.hohCompetition !== undefined) updateData.hohCompetition = body.hohCompetition
    if (body.hohWinnerId !== undefined) updateData.hohWinnerId = body.hohWinnerId || null
    if (body.nominees !== undefined) updateData.nominees = body.nominees || []
    if (body.povCompetition !== undefined) updateData.povCompetition = body.povCompetition
    if (body.povWinnerId !== undefined) updateData.povWinnerId = body.povWinnerId || null
    if (body.povUsed !== undefined) updateData.povUsed = body.povUsed
    if (body.povRemovedNomineeId !== undefined) updateData.povRemovedNomineeId = body.povRemovedNomineeId || null
    if (body.povReplacementId !== undefined) updateData.povReplacementId = body.povReplacementId || null
    if (body.blockbusterCompetition !== undefined) updateData.blockbusterCompetition = body.blockbusterCompetition
    if (body.blockbusterWinnerId !== undefined) updateData.blockbusterWinnerId = body.blockbusterWinnerId || null
    if (body.evictedNomineeId !== undefined) updateData.evictedNomineeId = body.evictedNomineeId || null
    if (body.evictionVote !== undefined) updateData.evictionVote = body.evictionVote

    // Update the week
    const { data: updatedWeek, error: updateError } = await supabase
      .from('weeks')
      .update(updateData)
      .eq('week', weekNumber)
      .select()
      .single()

    if (updateError) {
      console.error('Week update error:', updateError)
      return NextResponse.json({ error: 'Failed to update week' }, { status: 500 })
    }

    return NextResponse.json(updatedWeek)
  } catch (error) {
    console.error('Error updating week:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ n: string }> }) {
  return withRateLimit(request, () => handlePUT(request, { params }), { limit: 10, window: 60 })
}
