import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on your Prisma schema
export type Database = {
  public: {
    Tables: {
      houseguests: {
        Row: {
          id: string
          slug: string
          firstName: string
          lastName: string
          photoUrl: string | null
          bio: string | null
          status: 'IN' | 'EVICTED'
          evictionWeek: number | null
          evictionVote: string | null
          onTheBlockWeeks: number[]
          hohWins: number[]
          povWins: number[]
          blockbusterWins: number[]
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          slug: string
          firstName: string
          lastName: string
          photoUrl?: string | null
          bio?: string | null
          status?: 'IN' | 'EVICTED'
          evictionWeek?: number | null
          evictionVote?: string | null
          onTheBlockWeeks?: number[]
          hohWins?: number[]
          povWins?: number[]
          blockbusterWins?: number[]
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          slug?: string
          firstName?: string
          lastName?: string
          photoUrl?: string | null
          bio?: string | null
          status?: 'IN' | 'EVICTED'
          evictionWeek?: number | null
          evictionVote?: string | null
          onTheBlockWeeks?: number[]
          hohWins?: number[]
          povWins?: number[]
          blockbusterWins?: number[]
          createdAt?: string
          updatedAt?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          username: string
          photoUrl: string | null
          isAdmin: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          photoUrl?: string | null
          isAdmin?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          photoUrl?: string | null
          isAdmin?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
      picks: {
        Row: {
          id: string
          userId: string
          houseguestId: string
          createdAt: string
        }
        Insert: {
          id?: string
          userId: string
          houseguestId: string
          createdAt?: string
        }
        Update: {
          id?: string
          userId?: string
          houseguestId?: string
          createdAt?: string
        }
      }
      weeks: {
        Row: {
          id: string
          week: number
          hohCompetition: string | null
          hohWinnerId: string | null
          nominees: string[]
          povCompetition: string | null
          povWinnerId: string | null
          povUsed: boolean | null
          povRemovedNomineeId: string | null
          povReplacementId: string | null
          blockbusterCompetition: string | null
          blockbusterWinnerId: string | null
          evictedNomineeId: string | null
          evictionVote: string | null
          updatedAt: string
        }
        Insert: {
          id?: string
          week: number
          hohCompetition?: string | null
          hohWinnerId?: string | null
          nominees?: string[]
          povCompetition?: string | null
          povWinnerId?: string | null
          povUsed?: boolean | null
          povRemovedNomineeId?: string | null
          povReplacementId?: string | null
          blockbusterCompetition?: string | null
          blockbusterWinnerId?: string | null
          evictedNomineeId?: string | null
          evictionVote?: string | null
          updatedAt?: string
        }
        Update: {
          id?: string
          week?: number
          hohCompetition?: string | null
          hohWinnerId?: string | null
          nominees?: string[]
          povCompetition?: string | null
          povWinnerId?: string | null
          povUsed?: boolean | null
          povRemovedNomineeId?: string | null
          povReplacementId?: string | null
          blockbusterCompetition?: string | null
          blockbusterWinnerId?: string | null
          evictedNomineeId?: string | null
          evictionVote?: string | null
          updatedAt?: string
        }
      }
    }
  }
}
