import { Sketch } from '@prisma/client'
import {
  router,
  publicProcedure,
  protectedProcedure,
  voterProcedure,
  isAllowedVoter,
} from '../trpc'
import { z } from 'zod'

export type SketchWithImage = Sketch & {
  imageUrl?: string
}

export const sketchRouter = router({
  getTwoSketches: publicProcedure.query(async ({ ctx }) => {
    // Two random sketches need raw SQL (Prisma has no ORDER BY RANDOM()); their
    // meme images come back in ONE follow-up query and the random pick happens
    // here — was a query per sketch before.
    const sketches = await ctx.prisma.$queryRaw<
      Sketch[]
    >`SELECT * FROM "Sketch" ORDER BY RANDOM() LIMIT 2`

    const images = await ctx.prisma.image.findMany({
      where: { sketchId: { in: sketches.map((s) => s.id) } },
      select: { sketchId: true, fileName: true },
    })

    const s3BaseUrl = 'https://itysl-memes.s3.amazonaws.com/'
    return sketches.map((sketch): SketchWithImage => {
      const candidates = images.filter((img) => img.sketchId === sketch.id)
      const pick = candidates[Math.floor(Math.random() * candidates.length)]
      return { ...sketch, ...(pick ? { imageUrl: `${s3BaseUrl}${pick.fileName}` } : {}) }
    })
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

        const winnerRating = winner.rating
        const loserRating = loser.rating

        const expectedWinnerScore = 1 / (1 + 10 ** ((loserRating - winnerRating) / 400))
        const expectedLoserScore = 1 / (1 + 10 ** ((winnerRating - loserRating) / 400))

        const newWinnerRating = winnerRating + 32 * (1 - expectedWinnerScore)
        const newLoserRating = loserRating + 32 * (0 - expectedLoserScore)

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
      return ctx.prisma.sketch.findMany({
        orderBy: { rating: 'desc' },
        ...(input?.take ? { take: input.take } : {}),
      })
    }),
})
