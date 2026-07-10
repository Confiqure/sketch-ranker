import Link from 'next/link'
import { trpc } from '../utils/trpc'

// Landing page: what this is + straight into voting. The podium teases the live
// standings so the leaderboard feels alive before the first click.
export default function Home() {
  const { data: top } = trpc.sketch.getTopSketches.useQuery({ take: 3 })

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 px-6 pb-16">
      <div className="relative flex w-full max-w-3xl flex-col items-center pt-20 text-center">
        <div className="absolute inset-0 -z-10 bg-gradient-radial from-sky-100 via-transparent to-transparent blur-2xl" />
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Comedy Sketch Ranker
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-600">
          Head-to-head votes decide the definitive ranking of every{' '}
          <span className="font-semibold text-gray-800">I Think You Should Leave</span> sketch. Pick
          the funnier one — Elo does the rest.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/vote"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Start voting
          </Link>
          <Link
            href="/leaderboard"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            View leaderboard
          </Link>
        </div>
      </div>

      {top && top.length === 3 && (
        <div className="mt-16 w-full max-w-3xl">
          <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
            Current podium
          </h2>
          <ol className="grid gap-3 sm:grid-cols-3">
            {top.map((sketch, i) => (
              <li
                key={sketch.id}
                className="rounded-lg bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="text-2xl">{['🥇', '🥈', '🥉'][i]}</span>
                <p className="mt-1 font-semibold text-gray-800">{sketch.title}</p>
                <p className="text-sm text-gray-500">{sketch.rating.toFixed(1)}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </main>
  )
}
