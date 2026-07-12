import { createTRPCReact } from '@trpc/react-query'
import { AppRouter } from '@/pages/api/trpc/[trpc]'

export const trpc = createTRPCReact<AppRouter>()

// Patient client-side retry for the Aurora 0-ACU cold start (~10-15s resume):
// paired with the server's bounded withDbRetry, the UI self-heals without a
// manual refresh. Apply to READ queries only.
export const WARMUP_RETRY = {
  retry: 6,
  retryDelay: (attempt: number) => Math.min(1500 * 2 ** attempt, 8000),
} as const
