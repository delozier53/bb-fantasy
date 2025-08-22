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
  finalPlacement?: "WINNER" | "RUNNER_UP" | null
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
export const pointsForHG = (hg: Houseguest) => {
  // Competition wins
  const hohPoints = hg.wins.hoh.length * 5  // 5 points per HOH win
  const povPoints = hg.wins.pov.length * 3  // 3 points per POV win
  const blockbusterPoints = hg.wins.blockbuster.length * 3  // 3 points per Blockbuster win
  
  // Nomination survival points (1 point for each week nominated but not evicted)
  const nominationSurvivalPoints = hg.onTheBlockWeeks.length * 1
  
  // Weekly survival points (1 point for week 1, 2 for week 2, 3 for week 3, etc.)
  // Calculate based on how many weeks they survived (not including final week)
  const totalWeeksSurvived = hg.status === 'EVICTED' 
    ? (hg.eviction?.week || 0) - 1  // Survived until eviction week - 1
    : 16  // Assuming 16 weeks total, survived until week 15 (no points for final week)
  
  let weeklySurvivalPoints = 0
  for (let week = 1; week <= totalWeeksSurvived; week++) {
    weeklySurvivalPoints += week  // Week 1 = 1pt, Week 2 = 2pts, Week 3 = 3pts, etc.
  }
  
  // Final placement bonuses
  let placementBonus = 0
  if (hg.finalPlacement === 'WINNER') {
    placementBonus = 25  // 25 points for winning the game
  } else if (hg.finalPlacement === 'RUNNER_UP') {
    placementBonus = 10  // 10 points for being runner up
  }
  
  return hohPoints + povPoints + blockbusterPoints + nominationSurvivalPoints + weeklySurvivalPoints + placementBonus
}

export const pointsForUser = (user: User, roster: Record<string, Houseguest>) =>
  user.picks.reduce((s, id) => s + (roster[id] ? pointsForHG(roster[id]) : 0), 0)
