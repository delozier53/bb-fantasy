Tech stack

Runtime: Next.js API routes (Node 20)

DB: PostgreSQL + Prisma

Auth: NextAuth (email magic link) with isAdmin role flag

Storage: S3/R2 for profile & houseguest photos

Validation: Zod; rate limiting on mutations

Prisma schema (essential excerpt)
enum Status { IN EVICTED }

model Houseguest {
  id              String   @id @default(uuid())
  slug            String   @unique
  firstName       String
  lastName        String
  photoUrl        String?
  bio             String?
  status          Status   @default(IN)
  evictionWeek    Int?
  evictionVote    String?
  onTheBlockWeeks Int[]    @default([])

  hohWins         Int[]    @default([])
  povWins         Int[]    @default([])
  blockbusterWins Int[]    @default([])
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  photoUrl  String?
  isAdmin   Boolean  @default(false)
  picks     Pick[]
  createdAt DateTime @default(now())
}

model Pick {
  id           String    @id @default(uuid())
  userId       String
  houseguestId String
  User         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  Houseguest   Houseguest @relation(fields: [houseguestId], references: [id], onDelete: Cascade)
  @@unique([userId, houseguestId])
}

model Week {
  id                     String   @id @default(uuid())
  week                   Int      @unique
  hohCompetition         String?
  hohWinnerId            String?  @db.Uuid
  nominees               String[] @default([]) // 3 ids
  povCompetition         String?
  povWinnerId            String?  @db.Uuid
  povUsed                Boolean?
  povRemovedNomineeId    String?  @db.Uuid
  povReplacementId       String?  @db.Uuid
  blockbusterCompetition String?
  blockbusterWinnerId    String?  @db.Uuid
  evictedNomineeId       String?  @db.Uuid
  evictionVote           String?
  updatedAt              DateTime @updatedAt
}

Business rules

Scoring: 2 pts × (HOH wins + POV wins + Blockbuster wins) per houseguest.

Three nominees are supported each week (season format). 
Big Brother Network

Blockbuster stored as its own competition type with a winner each week (when applicable). 
CarterMatt

If povUsed = true → require both povRemovedNomineeId & povReplacementId.

If evictedNomineeId is set → it must be one of nominees; mark HG status=EVICTED and set evictionWeek/evictionVote.

Aggregations
-- Leaderboard (per user)
SELECT u.id, u.username, u."photoUrl",
  SUM( 2 * (cardinality(h."hohWins") + cardinality(h."povWins") + cardinality(h."blockbusterWins") )
  ) AS "totalPoints",
  SUM(CASE WHEN h.status = 'IN' THEN 1 ELSE 0 END) AS "remainingCount"
FROM "User" u
JOIN "Pick" p ON p."userId" = u.id
JOIN "Houseguest" h ON h.id = p."houseguestId"
GROUP BY u.id
ORDER BY "totalPoints" DESC;

REST API

Public (read):

GET /houseguests → Houseguest[]

GET /houseguests/:slug → Houseguest

GET /leaderboard → rows with totals + remaining

GET /users/:username → { user, picks: Houseguest[] }

GET /history?desc=1 → Week[] (newest first)

Authenticated (user):

POST /me → create/update { email, username, photoUrl }

POST /me/picks → { picks: string[5] } (exactly 5 unique ids)

Admin (role required):

PUT /admin/week/:n → partial update for Week N

PUT /admin/houseguest/:id → update bio/status/eviction

POST /admin/houseguests/seed → idempotent create/update by slug

Security & ops

AuthZ middleware gates all admin routes.

Rate-limit write endpoints; validate with Zod; log with pino.

Daily DB backups; migration scripts in CI.

Seed data

Create the 16 new HGs from CBS’s July 8 cast reveal (names below) plus Rachel Reilly (revealed as the “mystery houseguest” in the premiere).