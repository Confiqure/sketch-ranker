import { Sketch } from '@prisma/client'
import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export type SketchWithImage = Sketch & {
  imageUrl?: string
}

export const sketchRouter = router({
  getTwoSketches: publicProcedure.query(async ({ ctx }) => {
    const sketches = await ctx.prisma.$queryRaw<
      Sketch[]
    >`SELECT * FROM "Sketch" ORDER BY RANDOM() LIMIT 2`

    const s3BaseUrl = 'https://itysl-memes.s3.amazonaws.com/'

    const sketchesWithImage: SketchWithImage[] = await Promise.all(
      sketches.map(async (sketch) => {
        const sketchImage = await ctx.prisma.$queryRaw<
          { fileName: string }[]
        >`SELECT "fileName" FROM "Image" WHERE "sketchId" = ${sketch.id} ORDER BY RANDOM() LIMIT 1`
        const randomImageUrl = sketchImage.length ? `${s3BaseUrl}${sketchImage[0]?.fileName}` : null

        return {
          ...sketch,
          ...(randomImageUrl ? { imageUrl: randomImageUrl } : {}),
        }
      })
    )

    return sketchesWithImage
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

  getTopSketches: publicProcedure
    .input(z.object({ take: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.sketch.findMany({
        orderBy: { rating: 'desc' },
        ...(input?.take ? { take: input.take } : {}),
      })
    }),
})
