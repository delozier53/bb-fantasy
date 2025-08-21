Tech stack

Framework: Next.js 14 (App Router) + React 18 + TypeScript

UI: Tailwind CSS + shadcn/ui + Lucide icons

State & forms: TanStack Query, React Hook Form, Zod

Auth & uploads (suggested): NextAuth (email), S3/R2 for images

App structure (tabs & flows)
Tabs

Houseguests
Grid of cards (first name + photo + mini score). Badges for HOH ×n, POV ×n, Blockbuster ×n. Search + status filter (In / Evicted). Click → profile.

Houseguest Profile
Full name, photo, bio, competition wins by week, “On the Block” weeks, status (In/Evicted). If evicted: show vote total (e.g., 8–2 or 8–2–1) and eviction week.

Leaderboard
Users ranked by Total Points (desc). Columns: avatar, username, total points, # remaining (still in the game). Click → user profile showing their 5 picks, each with status and points.

History (reverse-chronological by week)
Collapsible Week N panels. Only fields the admin has filled are rendered:

HOH Competition • HOH Winner

Nominees (3) (season format)

POV Competition • POV Winner • Used POV?

If used: Removed nominee • Replacement nominee

Blockbuster Competition • Blockbuster Winner

Evicted Nominee • Eviction Vote
(Season 27 features three nominees and a “BB Blockbuster” event that can save a nominee.) 
Big Brother Network
CarterMatt

Flows

Welcome → Step 1: email, username, profile photo → Step 2: select exactly 5 houseguests → submit → /leaderboard.

Admin (role-gated) → pick/create week → fill winners/nominees via dropdowns (houseguest entities), text inputs for competition names & vote, toggle for “Used POV?” → save partial updates anytime.

Shared data shapes (client-side mirrors)
export type Houseguest = {
  id: string; slug: string;
  firstName: string; lastName: string;
  photoUrl?: string; bio?: string;
  status: "IN" | "EVICTED";
  eviction?: { week: number; vote: string } | null;
  onTheBlockWeeks: number[];
  wins: { hoh: number[]; pov: number[]; blockbuster: number[] };
};

export type User = {
  id: string; email: string; username: string; photoUrl?: string;
  picks: string[]; // 5 HG ids
};

export type Week = {
  week: number;
  hohCompetition?: string | null; hohWinnerId?: string | null;
  nominees?: [string?, string?, string?]; // 3 ids
  povCompetition?: string | null; povWinnerId?: string | null; povUsed?: boolean | null;
  povRemovedNomineeId?: string | null; povReplacementId?: string | null;
  blockbusterCompetition?: string | null; blockbusterWinnerId?: string | null;
  evictedNomineeId?: string | null; evictionVote?: string | null;
  updatedAt: string; // ISO
};

Points (client computation for instant UX; server is source of truth)
export const pointsForHG = (hg: Houseguest) =>
  2 * (hg.wins.hoh.length + hg.wins.pov.length + hg.wins.blockbuster.length);

export const pointsForUser = (user: User, roster: Record<string, Houseguest>) =>
  user.picks.reduce((s, id) => s + (roster[id] ? pointsForHG(roster[id]) : 0), 0);

Routes

/houseguests (grid) → /houseguests/[slug] (profile)

/leaderboard → /u/[username]

/history (panels, newest first)

/welcome (2-step onboarding)

/admin (role-gated editor)

API (consumed by TanStack Query)

GET /api/houseguests → Houseguest[]

GET /api/houseguests/[slug] → Houseguest

GET /api/leaderboard → rows with { username, photoUrl, totalPoints, remainingCount }

GET /api/users/[username] → { user, houseguests: Houseguest[] }

GET /api/history?desc=1 → Week[]

Admin: PUT /api/admin/week/[n], PUT /api/admin/houseguest/[id], POST /api/admin/houseguests/seed

UI components (high level)

HouseguestCard, HouseguestProfile

UserRow, UserTeamList

WeekPanel (renders only non-null fields)

AdminWeekForm (dropdowns for all houseguest-typed fields; text inputs for competitions & votes; toggle for POV use)

Seed list (cast used to initialize DB)

Adrian Rocha; Amy Bingham; Ashley Hollis; Ava Pearl; Cliffton Williams; Isaiah Frederich; Jimmy Heagerty; Katherine Woodman; Keanu Soto; Kelley Jorgensen; Lauren Domingue; Mickey Lee; Morgan Pope; Rylie Jeffries; Vince Panaro; Zach Cornell. 
TV Insider

Mystery/returning HG: Rachel Reilly (revealed on the S27 premiere; currently competing). 
EW.com
Parade

Accessibility & polish

Keyboard-navigable grids/accordions; alt text on all images; contrast-safe.

Skeletons & “not yet updated” placeholders for History.

Reverse sort History by week DESC; hide null fields until the admin fills them.