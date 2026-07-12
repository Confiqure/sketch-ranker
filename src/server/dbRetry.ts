// Aurora Serverless v2 pauses at 0 ACU when idle, and the first queries after a
// pause fail for the ~10–15s the cluster takes to resume. Bounded retry for READ
// paths so a cold visitor gets data instead of a 500 — writes are deliberately
// never wrapped (an auto-retried vote could double-fire; the vote UI already has
// its own "database may be waking up" error + manual retry).

const BACKOFF_MS = [1500, 3000, 4500] // ~9s total across 4 attempts

export async function withDbRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastErr: unknown
  for (let attempt = 0; attempt <= BACKOFF_MS.length; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (attempt < BACKOFF_MS.length) {
        await new Promise((resolve) => setTimeout(resolve, BACKOFF_MS[attempt]))
      }
    }
  }
  throw lastErr
}
