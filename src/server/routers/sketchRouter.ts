import { Sketch } from '@prisma/client'
import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const sketchRouter = router({
  getTwoSketches: publicProcedure.query(async ({ ctx }) => {
    const sketches = await ctx.prisma.$queryRaw`
        SELECT * FROM "Sketch"
        ORDER BY RANDOM()
        LIMIT 2;
    `

    return sketches as Sketch[]
  }),

  voteForSketch: publicProcedure
    .input(z.object({ winnerId: z.string(), loserId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { winnerId, loserId } = input

      const winner = await ctx.prisma.sketch.findUnique({ where: { id: winnerId } })
      const loser = await ctx.prisma.sketch.findUnique({ where: { id: loserId } })

      if (!winner || !loser) return

      const winnerRating = winner.rating
      const loserRating = loser.rating

      const expectedWinnerScore = 1 / (1 + 10 ** ((loserRating - winnerRating) / 400))
      const expectedLoserScore = 1 / (1 + 10 ** ((winnerRating - loserRating) / 400))

      const newWinnerRating = winnerRating + 32 * (1 - expectedWinnerScore)
      const newLoserRating = loserRating + 32 * (0 - expectedLoserScore)

      await ctx.prisma.sketch.update({ where: { id: winnerId }, data: { rating: newWinnerRating } })
      await ctx.prisma.sketch.update({ where: { id: loserId }, data: { rating: newLoserRating } })
    }),

  getTopSketches: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.sketch.findMany({
      orderBy: { rating: 'desc' },
      take: 50,
    })
  }),
})
