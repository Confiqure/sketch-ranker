import { router, adminProcedure } from '../trpc'
import { z } from 'zod'

// Sketch + image management for the /admin page. Every procedure is gated on the
// ADMIN_EMAILS allowlist (see trpc.ts adminProcedure).
export const adminRouter = router({
  listSketches: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.sketch.findMany({
      orderBy: [{ collection: 'asc' }, { title: 'asc' }],
      include: {
        images: true,
        _count: { select: { votesWon: true, votesLost: true } },
      },
    })
  }),

  createSketch: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        collection: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.sketch.create({ data: input })
    }),

  updateSketch: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        collection: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.sketch.update({ where: { id }, data })
    }),

  deleteSketch: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Images + votes cascade via the schema's onDelete rules.
      return ctx.prisma.sketch.delete({ where: { id: input.id } })
    }),

  addImage: adminProcedure
    .input(z.object({ sketchId: z.string(), fileName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.image.create({ data: input })
    }),

  deleteImage: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.image.delete({ where: { id: input.id } })
    }),

  // ── voter allowlist (voting is sign-in + allowlist gated) ──────────────────

  listVoters: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.allowedVoter.findMany({ orderBy: { addedAt: 'asc' } })
  }),

  addVoter: adminProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const email = input.email.trim().toLowerCase()
      return ctx.prisma.allowedVoter.upsert({
        where: { email },
        create: { email },
        update: {},
      })
    }),

  removeVoter: adminProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.allowedVoter.delete({ where: { email: input.email.toLowerCase() } })
    }),
})
