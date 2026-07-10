// Post-restore data-integrity check — READ-ONLY (never mutates ratings or votes).
//
// Run after the Aurora cluster is up, before flipping the site live:
//   DATABASE_URL='postgresql://…/prod?schema=public&sslmode=require&connect_timeout=30' \
//     node scripts/validate-restore.mjs
//
// Verifies the snapshot restore brought the real corpus back: row counts, that the
// Elo standings are the accumulated originals (ratings ≠ all-1000), and prints the
// top 5 so a human can eyeball them against memory. Exits 1 on any failed check.

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})
const fail = []
const check = (label, ok, detail) => {
  console.log(`${ok ? '✅' : '❌'} ${label}${detail ? ` — ${detail}` : ''}`)
  if (!ok) fail.push(label)
}

const [users, sketches, images, ratings] = await Promise.all([
  prisma.user.count(),
  prisma.sketch.count(),
  prisma.image.count(),
  prisma.sketch.aggregate({ _min: { rating: true }, _max: { rating: true } }),
])

// Informational only: voting has always been anonymous (public procedure), so a
// restored prod DB can legitimately have zero signed-in users (verified 2026-07-10:
// 0 users / 0 accounts / 0 sessions in the original data).
console.log(`ℹ️  users: ${users} account(s) — sign-in was never required to vote`)
check('sketch catalog restored', sketches >= 80, `${sketches} sketches (seed was 86)`)
check('meme images restored', images > 0, `${images} image rows`)
check(
  'Elo standings are the originals (not reset)',
  ratings._min.rating !== ratings._max.rating,
  `rating range ${ratings._min.rating?.toFixed(1)} … ${ratings._max.rating?.toFixed(1)}`
)

// The vote log is NEW at revival — it must exist (migration applied) and start empty-ish.
try {
  const votes = await prisma.vote.count()
  check('vote log table exists (new migration applied)', true, `${votes} vote(s) so far`)
} catch {
  check('vote log table exists (new migration applied)', false, 'run `npx prisma migrate deploy`')
}

console.log('\nTop 5 restored standings:')
const top = await prisma.sketch.findMany({ orderBy: { rating: 'desc' }, take: 5 })
for (const [i, s] of top.entries()) console.log(`  ${i + 1}. ${s.title} — ${s.rating.toFixed(1)}`)

await prisma.$disconnect()
if (fail.length) {
  console.error(`\n${fail.length} check(s) failed`)
  process.exit(1)
}
console.log('\nAll restore checks passed.')
