import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// One PrismaClient for the whole app (tRPC context + NextAuth adapter). Prisma 7
// connects through a driver adapter — the connection URL lives here at runtime and
// in prisma.config.ts for the CLI. The global cache keeps Next.js dev hot-reload
// from leaking a new client per reload.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
