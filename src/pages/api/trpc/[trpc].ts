import * as trpcNext from '@trpc/server/adapters/next'
import { createContext } from '@/server/context'
import { publicProcedure, router } from '@/server/trpc'

export const appRouter = router({
  // Example procedure
  example: publicProcedure.query(() => {
    return 'Hello from tRPC!'
  }),
})

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
})
