import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { prisma } from './db'

// Session rides the context so procedures can auth-gate (admin router, vote attribution).
export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerSession(opts.req, opts.res, authOptions)
  return { prisma, session }
}

export type Context = Awaited<ReturnType<typeof createContext>>
