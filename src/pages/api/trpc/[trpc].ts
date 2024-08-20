import * as trpcNext from '@trpc/server/adapters/next'
import { createContext } from '@/server/context'
import { router } from '@/server/trpc'
import { sketchRouter } from '@/server/routers/sketchRouter'

export const appRouter = router({
  sketch: sketchRouter,
})

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
})
