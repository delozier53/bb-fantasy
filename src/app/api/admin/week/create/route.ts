import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withRateLimit } from '@/lib/rate-limit'

async function handlePOST(request: NextRequest) {
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

    // Get the current highest week number
    const { data: existingWeeks, error: weeksError } = await supabase
      .from('weeks')
      .select('week')
      .order('week', { ascending: false })
      .limit(1)

    if (weeksError) {
      console.error('Error fetching existing weeks:', weeksError)
      return NextResponse.json({ error: 'Failed to fetch existing weeks' }, { status: 500 })
    }

    const nextWeekNumber = existingWeeks && existingWeeks.length > 0 
      ? existingWeeks[0].week + 1 
      : 1

    // Create the new week
    const { data: newWeek, error: createError } = await supabase
      .from('weeks')
      .insert({
        week: nextWeekNumber,
        hohCompetition: null,
        hohWinnerId: null,
        nominees: [],
        povCompetition: null,
        povWinnerId: null,
        povUsed: null,
        povRemovedNomineeId: null,
        povReplacementId: null,
        blockbusterCompetition: null,
        blockbusterWinnerId: null,
        evictedNomineeId: null,
        evictionVote: null,
        updatedAt: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating new week:', createError)
      return NextResponse.json({ error: 'Failed to create new week' }, { status: 500 })
    }

    return NextResponse.json(newWeek)
  } catch (error) {
    console.error('Error creating new week:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, () => handlePOST(request), { limit: 5, window: 60 })
}
