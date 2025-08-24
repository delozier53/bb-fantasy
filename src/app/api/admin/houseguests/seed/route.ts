import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const houseguests = [
  { firstName: 'Adrian', lastName: 'Rocha', slug: 'adrian-rocha' },
  { firstName: 'Amy', lastName: 'Bingham', slug: 'amy-bingham' },
  { firstName: 'Ashley', lastName: 'Hollis', slug: 'ashley-hollis' },
  { firstName: 'Ava', lastName: 'Pearl', slug: 'ava-pearl' },
  { firstName: 'Cliffton', lastName: 'Williams', slug: 'cliffton-williams' },
  { firstName: 'Isaiah', lastName: 'Frederich', slug: 'isaiah-frederich' },
  { firstName: 'Jimmy', lastName: 'Heagerty', slug: 'jimmy-heagerty' },
  { firstName: 'Katherine', lastName: 'Woodman', slug: 'katherine-woodman' },
  { firstName: 'Keanu', lastName: 'Soto', slug: 'keanu-soto' },
  { firstName: 'Kelley', lastName: 'Jorgensen', slug: 'kelley-jorgensen' },
  { firstName: 'Lauren', lastName: 'Domingue', slug: 'lauren-domingue' },
  { firstName: 'Mickey', lastName: 'Lee', slug: 'mickey-lee' },
  { firstName: 'Morgan', lastName: 'Pope', slug: 'morgan-pope' },
  { firstName: 'Rylie', lastName: 'Jeffries', slug: 'rylie-jeffries' },
  { firstName: 'Vince', lastName: 'Panaro', slug: 'vince-panaro' },
  { firstName: 'Zach', lastName: 'Cornell', slug: 'zach-cornell' },
  { firstName: 'Rachel', lastName: 'Reilly', slug: 'rachel-reilly' },
]

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const results = []

    for (const houseguest of houseguests) {
      const { data: result, error } = await supabase
        .from('houseguests')
        .upsert({
          ...houseguest,
          status: 'IN',
          hohWins: [],
          povWins: [],
          blockbusterWins: [],
          onTheBlockWeeks: [],
        }, {
          onConflict: 'slug'
        })
        .select()
        .single()

      if (error) {
        console.error(`Error upserting houseguest ${houseguest.slug}:`, error)
        continue
      }

      if (result) {
        results.push(result)
      }
    }

    return NextResponse.json({
      message: `Successfully seeded ${results.length} houseguests`,
      count: results.length,
      houseguests: results.map(hg => ({
        id: hg.id,
        slug: hg.slug,
        firstName: hg.firstName,
        lastName: hg.lastName,
      })),
    })
  } catch (error) {
    console.error('Error seeding houseguests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
