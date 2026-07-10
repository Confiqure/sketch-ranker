import { Sketch } from '@prisma/client'
import {
  router,
  publicProcedure,
  protectedProcedure,
  voterProcedure,
  isAllowedVoter,
} from '../trpc'
import { z } from 'zod'
import { eloUpdate, replayPersonalElo } from '../elo'
import { attachRandomImages } from '../images'

export type SketchWithImage = Sketch & {
  imageUrl?: string
}

export const sketchRouter = router({
  getTwoSketches: publicProcedure.query(async ({ ctx }) => {
    // Two random sketches need raw SQL (Prisma has no ORDER BY RANDOM()); their
    // meme images come back in ONE follow-up query via the shared helper.
    const sketches = await ctx.prisma.$queryRaw<
      Sketch[]
    >`SELECT * FROM "Sketch" ORDER BY RANDOM() LIMIT 2`
    return attachRandomImages(ctx.prisma, sketches)
  }),

  // The signed-in caller's gate state — drives the /vote page's three UX states.
  getVoterStatus: protectedProcedure.query(async ({ ctx }) => {
    return { allowed: await isAllowedVoter(ctx) }
  }),

  voteForSketch: voterProcedure
    .input(
      z
        .object({ winnerId: z.string(), loserId: z.string() })
        .refine((v) => v.winnerId !== v.loserId, { message: 'A sketch cannot beat itself' })
    )
    .mutation(async ({ ctx, input }) => {
      const { winnerId, loserId } = input

      // One transaction: read both ratings, apply Elo, record the vote event —
      // so a concurrent vote can't clobber the read-modify-write rating update.
      await ctx.prisma.$transaction(async (tx) => {
        const winner = await tx.sketch.findUnique({ where: { id: winnerId } })
        const loser = await tx.sketch.findUnique({ where: { id: loserId } })

        if (!winner || !loser) return

        const [newWinnerRating, newLoserRating] = eloUpdate(winner.rating, loser.rating)

        await tx.sketch.update({ where: { id: winnerId }, data: { rating: newWinnerRating } })
        await tx.sketch.update({ where: { id: loserId }, data: { rating: newLoserRating } })
        await tx.vote.create({
          data: { winnerId, loserId, userId: ctx.session?.user?.id ?? null },
        })
      })
    }),

  // Signed-in voters see their own tally on /profile.
  getMyVoteCount: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user?.id
    if (!userId) return 0
    return ctx.prisma.vote.count({ where: { userId } })
  }),

  getTopSketches: publicProcedure
    .input(z.object({ take: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      // Images + win/loss tallies ride along so the podium and leaderboard can
      // show a still and a record without extra round-trips.
      const sketches = await ctx.prisma.sketch.findMany({
        orderBy: { rating: 'desc' },
        include: { _count: { select: { votesWon: true, votesLost: true } } },
        ...(input?.take ? { take: input.take } : {}),
      })
      return attachRandomImages(ctx.prisma, sketches)
    }),

  // "Your taste, ranked" — the caller's own votes replayed through the shared
  // Elo math (see server/elo.ts). No denormalized state: the Vote log is the
  // source of truth, so this is always exactly consistent with their history.
  getMyLeaderboard: protectedProcedure
    .input(z.object({ take: z.number().min(1).max(100).optional() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user?.id
      if (!userId) return { entries: [], sketchesRanked: 0, votesCast: 0 }

      const votes = await ctx.prisma.vote.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        select: { winnerId: true, loserId: true },
      })
      const standings = replayPersonalElo(votes)
      const top = standings.slice(0, input?.take ?? 10)

      const sketches = await ctx.prisma.sketch.findMany({
        where: { id: { in: top.map((s) => s.sketchId) } },
        select: { id: true, title: true, collection: true, description: true },
      })
      const byId = new Map(sketches.map((s) => [s.id, s]))
      const withImages = await attachRandomImages(
        ctx.prisma,
        top.flatMap((standing) => {
          const sketch = byId.get(standing.sketchId)
          return sketch ? [{ ...standing, ...sketch }] : [] // dropped = sketch deleted since
        })
      )

      return {
        entries: withImages,
        sketchesRanked: standings.length,
        votesCast: votes.length,
      }
    }),
})
