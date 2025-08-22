import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const { data: houseguest, error } = await supabase
      .from('houseguests')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Houseguest not found' },
          { status: 404 }
        )
      }
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch houseguest' },
        { status: 500 }
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
      onTheBlockWeeks: houseguest.onTheBlockWeeks || [],
      wins: {
        hoh: houseguest.hohWins || [],
        pov: houseguest.povWins || [],
        blockbuster: houseguest.blockbusterWins || [],
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
