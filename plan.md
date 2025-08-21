Milestones

M0 — Setup (0.5 wk): Repo, Next.js + Tailwind + shadcn/ui; Prisma + Postgres; NextAuth; CI.

M1 — Welcome & Picks (1 wk): /welcome flow; POST /me & POST /me/picks; enforce exactly 5 selections.

M2 — Houseguests (1 wk): Grid + profile pages; search/filter; score badges.

M3 — Leaderboard (0.5–1 wk): Aggregation query; user profile with per-HG points + status.

M4 — History (1–1.5 wks): Week model; reverse-chron rendering; hide null fields.

M5 — Admin (1–1.5 wks): Week editor (HG dropdowns; text fields; POV toggle); partial saves; role gating.

M6 — Polish (0.5–1 wk): A11y pass, image fallbacks, empty states, rate limits, backups.

Acceptance criteria

Houseguest tab shows all HGs with first name + photo, points, and win counts; profile shows full details, on-the-block weeks, and eviction info (with vote).

Leaderboard ranks by total points; each team shows 5 houseguests with status + points.

History lists Week N → 1, only updated fields visible; supports 3 nominees and Blockbuster. 
Big Brother Network
CarterMatt

Admin can update weeks continuously; fields appear only after being filled.

Cast seed (for initial DB)

Adrian Rocha; Amy Bingham; Ashley Hollis; Ava Pearl; Cliffton Williams; Isaiah Frederich; Jimmy Heagerty; Katherine Woodman; Keanu Soto; Kelley Jorgensen; Lauren Domingue; Mickey Lee; Morgan Pope; Rylie Jeffries; Vince Panaro; Zach Cornell; Rachel Reilly. 
TV Insider
EW.com

Notes on sources

The Today.com URL you provided blocks automated access; we cross-verified the same cast via TV Insider (full gallery list) and the premiere’s mystery houseguest reveal via Entertainment Weekly/Parade. 
TV Insider
EW.com
Parade

Data & mechanics references

Season 27 cast reveal (16 new HGs): TV Insider gallery. 
TV Insider

Rachel Reilly revealed as the “mystery” returning HG: EW & Parade. 
EW.com
Parade

Season format uses three nominees & “BB Blockbuster” (nominee-save event): BigBrotherNetwork explainer + CarterMatt primer. 
Big Brother Network
CarterMatt