export type Houseguest = {
  id: string
  slug: string
  firstName: string
  lastName: string
  photoUrl?: string
  bio?: string
  status: "IN" | "EVICTED"
  eviction?: { week: number; vote: string } | null
  onTheBlockWeeks: number[]
  wins: { hoh: number[]; pov: number[]; blockbuster: number[] }
}

export type User = {
  id: string
  email: string
  username: string
  photoUrl?: string
  isAdmin: boolean
  picks: string[] // 5 HG ids
}

export type Week = {
  week: number
  hohCompetition?: string | null
  hohWinnerId?: string | null
  nominees?: [string?, string?, string?] // 3 ids
  povCompetition?: string | null
  povWinnerId?: string | null
  povUsed?: boolean | null
  povRemovedNomineeId?: string | null
  povReplacementId?: string | null
  blockbusterCompetition?: string | null
  blockbusterWinnerId?: string | null
  evictedNomineeId?: string | null
  evictionVote?: string | null
  updatedAt: string // ISO
}

export type LeaderboardEntry = {
  username: string
  photoUrl?: string
  totalPoints: number
  remainingCount: number
}

// Points calculation utilities
export const pointsForHG = (hg: Houseguest) =>
  2 * (hg.wins.hoh.length + hg.wins.pov.length + hg.wins.blockbuster.length)

export const pointsForUser = (user: User, roster: Record<string, Houseguest>) =>
  user.picks.reduce((s, id) => s + (roster[id] ? pointsForHG(roster[id]) : 0), 0)
