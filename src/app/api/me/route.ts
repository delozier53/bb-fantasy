import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { withRateLimit } from '@/lib/rate-limit'

const createUserSchema = z.object({
  username: z.string().min(3).max(20),
})

async function handlePOST(request: NextRequest) {
  try {
    console.log('Profile creation started')
    
    // Use our custom session system instead of NextAuth
    const sessionToken = request.cookies.get('next-auth.session-token')?.value

    if (!sessionToken) {
      console.log('No session token found')
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
      console.log('Session not found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      console.log('Session expired')
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    // Get the user
    const { data: user, error: sessionUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.userId)
      .single()

    if (sessionUserError || !user) {
      console.log('User not found')
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const formData = await request.formData()
    const username = formData.get('username') as string
    const photoFile = formData.get('photoFile') as File

    console.log('Username:', username)
    console.log('Photo file:', photoFile?.name, photoFile?.size)

    if (!username || !photoFile) {
      console.log('Missing username or photo file')
      return NextResponse.json({ error: 'Username and photo are required' }, { status: 400 })
    }

    // Validate username
    const { username: validatedUsername } = createUserSchema.parse({ username })

    // Check if username is already taken
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('username', validatedUsername)
      .single()

    if (existingUser && existingUser.email !== user.email) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      )
    }

    // Convert file to base64 for now (simpler approach)
    const arrayBuffer = await photoFile.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const dataUrl = `data:${photoFile.type};base64,${base64}`

    // Update the existing user
    const { data: updatedUser, error: userError } = await supabase
      .from('users')
      .update({
        username: validatedUsername,
        photoUrl: dataUrl,
      })
      .eq('id', user.id)
      .select()
      .single()

    if (userError) {
      console.error('User creation error:', userError)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      photoUrl: updatedUser.photoUrl,
      isAdmin: updatedUser.isAdmin,
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

export async function POST(request: NextRequest) {
  return withRateLimit(request, handlePOST, { limit: 5, window: 60 })
}

async function handleGET(request: NextRequest) {
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
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select(`
        *,
        picks (
          houseguestId
        )
      `)
      .eq('id', session.userId)
      .single()

    if (getUserError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      photoUrl: user.photoUrl,
      isAdmin: user.isAdmin,
      picks: user.picks?.map(pick => pick.houseguestId) || [],
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => handleGET(), { limit: 30, window: 60 })
}

async function handlePUT(request: NextRequest) {
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

    // Get the current user
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.userId)
      .single()

    if (getUserError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const formData = await request.formData()
    const username = formData.get('username') as string
    const photoFile = formData.get('photo') as File

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    // Validate username
    const { username: validatedUsername } = createUserSchema.parse({ username })

    // Check if username is already taken by another user
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('username', validatedUsername)
      .neq('id', user.id)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      username: validatedUsername,
    }

    // Handle photo upload if provided
    if (photoFile) {
      const arrayBuffer = await photoFile.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const dataUrl = `data:${photoFile.type};base64,${base64}`
      updateData.photoUrl = dataUrl
    }

    // Update the user
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('User update error:', updateError)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      photoUrl: updatedUser.photoUrl,
      isAdmin: updatedUser.isAdmin,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  return withRateLimit(request, handlePUT, { limit: 5, window: 60 })
}
