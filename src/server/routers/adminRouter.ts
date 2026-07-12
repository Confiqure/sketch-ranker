import { router, adminProcedure } from '../trpc'
import { z } from 'zod'

// Sketch + image management for the /admin page. Every procedure is gated on the
// ADMIN_EMAILS allowlist (see trpc.ts adminProcedure).
export const adminRouter = router({
  // Paginated + searchable so the page never loads all 86 sketches (with images
  // and vote counts) in one shot. Search matches title/collection/description.
  listSketches: adminProcedure
    .input(
      z.object({
        query: z.string().trim().optional(),
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = input.query
        ? {
            OR: [
              { title: { contains: input.query, mode: 'insensitive' as const } },
              { collection: { contains: input.query, mode: 'insensitive' as const } },
              { description: { contains: input.query, mode: 'insensitive' as const } },
            ],
          }
        : {}
      const [total, sketches] = await ctx.prisma.$transaction([
        ctx.prisma.sketch.count({ where }),
        ctx.prisma.sketch.findMany({
          where,
          orderBy: [{ collection: 'asc' }, { title: 'asc' }],
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
          include: {
            images: true,
            _count: { select: { votesWon: true, votesLost: true } },
          },
        }),
      ])
      return { sketches, total, page: input.page, pageSize: input.pageSize }
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
