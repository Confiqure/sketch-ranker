import * as trpcNext from '@trpc/server/adapters/next'
import { router, createContext, publicProcedure } from '../../../server/trpc'

const appRouter = router({
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
