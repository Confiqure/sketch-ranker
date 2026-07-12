import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { trpc, WARMUP_RETRY } from '../utils/trpc'
import PageMeta from '@/components/PageMeta'
import { ROUTES } from '@/site.config'

const MEDALS = ['🥇', '🥈', '🥉'] as const

export default function Profile() {
  const { data: session } = useSession()
  // "Your taste, ranked" — the caller's own votes replayed through the same Elo
  // math as the global board (server/elo.ts). votesCast rides along, so no
  // separate count query.
  const { data: myBoard, isLoading } = trpc.sketch.getMyLeaderboard.useQuery(
    { take: 10 },
    { enabled: !!session, ...WARMUP_RETRY }
  )

  const meta = <PageMeta title="Profile" path={ROUTES.profile} />

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream">
        {meta}
        <h1 className="mb-4 font-goofy text-3xl text-ink">You are not signed in</h1>
        <button
          onClick={() => signIn('google', { callbackUrl: '/profile' })}
          className="rounded-xl bg-sky-pop px-6 py-2 font-semibold text-white transition-colors hover:bg-sky-pop-dark"
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-cream p-6">
      {meta}
      <div className="w-full max-w-md rounded-2xl border-2 border-ink/10 bg-white p-8 shadow-md">
        <div className="flex flex-col items-center">
          {session.user?.image && (
            <Image
              src={session.user.image}
              width={100}
              height={100}
              className="mb-4 rounded-full ring-4 ring-mustard/50"
              alt="User Image"
            />
          )}
          <h1 className="font-goofy text-2xl text-ink">{session.user?.name}</h1>
          <p className="text-sm text-ink/50">{session.user?.email}</p>
          {myBoard && (
            <p className="mt-3 text-ink/70">
              <span className="font-semibold text-ink">{myBoard.votesCast}</span> votes across{' '}
              <span className="font-semibold text-ink">{myBoard.sketchesRanked}</span> sketches
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 w-full max-w-md rounded-2xl border-2 border-ink/10 bg-white p-8 shadow-md">
        <h2 className="mb-1 text-center font-goofy text-xl text-ink">Your taste, ranked</h2>
        <p className="mb-4 text-center text-sm text-ink/50">
          Only <em>your</em> votes count here. Your private Elo, same math as the big board.
        </p>
        {isLoading ? (
          <p className="text-center text-ink/50">Crunching your votes…</p>
        ) : !myBoard || myBoard.entries.length === 0 ? (
          <p className="text-center text-ink/60">
            No votes yet.{' '}
            <Link href={ROUTES.vote} className="text-sky-pop hover:underline">
              go pick some favorites
            </Link>
            .
          </p>
        ) : (
          <ol className="space-y-3">
            {myBoard.entries.map((entry, i) => (
              <li key={entry.sketchId} className="flex items-center gap-3">
                <span className="w-7 shrink-0 text-center text-lg">
                  {MEDALS[i] ?? <span className="font-goofy text-sm text-ink/50">{i + 1}</span>}
                </span>
                {entry.imageUrl && (
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={entry.imageUrl}
                      alt={entry.title}
                      fill
                      sizes="4rem"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{entry.title}</p>
                  <p className="text-xs text-ink/40">
                    {entry.wins}W–{entry.losses}L · {entry.rating.toFixed(0)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <button
        onClick={() => signOut()}
        className="mt-6 rounded-xl bg-ketchup px-6 py-2 font-semibold text-white transition-colors hover:bg-ketchup-dark"
      >
        Sign out
      </button>
    </div>
  )
}
