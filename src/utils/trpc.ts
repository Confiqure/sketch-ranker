import { createTRPCReact } from '@trpc/react-query'
import { AppRouter } from '@/pages/api/trpc/[trpc]'

export const trpc = createTRPCReact<AppRouter>()
