import Link from 'next/link'
import { trpc, WARMUP_RETRY } from '../utils/trpc'
import Podium, { PodiumSkeleton } from '@/components/Podium'
import PageMeta from '@/components/PageMeta'
import { COPY, ROUTES } from '@/site.config'

// Landing page: what this is + straight into voting. The podium teases the live
// standings — random stills per load, first place biggest — so the leaderboard
// feels alive before the first click.
export default function Home() {
  const { data: top, isError } = trpc.sketch.getTopSketches.useQuery({ take: 3 }, WARMUP_RETRY)

  return (
    <main className="flex min-h-screen flex-col items-center bg-cream px-6 pb-16">
      <PageMeta />
      <div className="relative flex w-full max-w-3xl flex-col items-center pt-20 text-center">
        <div className="absolute inset-0 -z-10 bg-gradient-radial from-mustard/20 via-transparent to-transparent blur-2xl" />
        <h1 className="font-goofy text-4xl tracking-tight text-ink sm:text-5xl">
          Comedy Sketch <span className="text-ketchup">Ranker</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink/60">
          Head-to-head votes decide the definitive ranking of every{' '}
          <span className="font-semibold text-ink">I Think You Should Leave</span> sketch. Pick the
          funnier one. Elo does the rest. You gotta.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href={ROUTES.vote}
            className="rounded-xl bg-ketchup px-6 py-3 font-semibold text-white transition-all hover:animate-wiggle hover:bg-ketchup-dark"
          >
            Start voting
          </Link>
          <Link
            href={ROUTES.leaderboard}
            className="rounded-xl border-2 border-ink/15 bg-white px-6 py-3 font-semibold text-ink/80 transition-colors hover:bg-cream-deep"
          >
            View leaderboard
          </Link>
        </div>
      </div>

      <div className="mt-16 w-full max-w-3xl animate-pop-in">
        <h2 className="mb-4 text-center font-goofy text-sm uppercase tracking-wide text-ink/50">
          Current podium
        </h2>
        {top && top.length === 3 ? (
          <Podium top={top} />
        ) : isError ? (
          <p className="text-center text-sm text-ink/50">{COPY.snoozing}</p>
        ) : (
          <PodiumSkeleton />
        )}
      </div>
    </main>
  )
}
