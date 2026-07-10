import { TRPCError, initTRPC } from '@trpc/server'
import { type Context } from './context'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase())
}

/** Admins are implicitly voters; everyone else needs an AllowedVoter row. */
export const isAllowedVoter = async (ctx: Context): Promise<boolean> => {
  const email = ctx.session?.user?.email?.toLowerCase()
  if (!email) return false
  if (isAdminEmail(email)) return true
  const row = await ctx.prisma.allowedVoter.findUnique({ where: { email } })
  return row !== null
}

// Signed-in users only (session guaranteed non-null downstream).
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({ ctx: { ...ctx, session: ctx.session } })
})

// Approved voters only (sign-in + allowlist — the 2026-07-10 voting gate).
export const voterProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!(await isAllowedVoter(ctx))) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Not on the voter list' })
  }
  return next()
})

// Admins only — the comma-separated ADMIN_EMAILS env var is the allowlist.
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!isAdminEmail(ctx.session.user?.email)) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admins only' })
  }
  return next()
})
