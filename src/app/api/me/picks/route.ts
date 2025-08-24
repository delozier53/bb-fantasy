import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { withRateLimit } from '@/lib/rate-limit'

const updatePicksSchema = z.object({
  picks: z.array(z.string()).length(5, 'Must select exactly 5 houseguests'),
})

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

    // Get the user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { picks } = updatePicksSchema.parse(body)

    // Verify all houseguest IDs exist
    const { data: houseguests, error: houseguestsError } = await supabase
      .from('houseguests')
      .select('id')
      .in('id', picks)

    if (houseguestsError || houseguests.length !== 5) {
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

    // Delete existing picks
    const { error: deleteError } = await supabase
      .from('picks')
      .delete()
      .eq('userId', user.id)

    if (deleteError) {
      console.error('Error deleting existing picks:', deleteError)
      return NextResponse.json({ error: 'Failed to update picks' }, { status: 500 })
    }

    // Create new picks
    const picksData = picks.map(houseguestId => ({
      userId: user.id,
      houseguestId,
    }))

    const { error: insertError } = await supabase
      .from('picks')
      .insert(picksData)

    if (insertError) {
      console.error('Error inserting picks:', insertError)
      return NextResponse.json({ error: 'Failed to update picks' }, { status: 500 })
    }

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
