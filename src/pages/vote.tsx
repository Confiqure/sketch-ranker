import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import SketchVote, { VOTE_COOLDOWN_MS } from '@/components/SketchVote'
import { trpc, WARMUP_RETRY } from '../utils/trpc'
import LeaderboardProgress from '@/components/LeaderboardProgress'
import ShortcutGuide from '@/components/ShortcutGuide'
import PageMeta from '@/components/PageMeta'
import { ROUTES } from '@/site.config'

// Friendly full-page state for the two "can't vote yet" cases.
const GateCard = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6">
    <PageMeta title="Vote" path={ROUTES.vote} />
    <div className="w-full max-w-md rounded-2xl border-2 border-ink/10 bg-white p-8 text-center shadow-md">
      {children}
    </div>
  </div>
)

const VotePage = () => {
  const { data: session, status } = useSession()
  const utils = trpc.useUtils()
  const { data: voterStatus } = trpc.sketch.getVoterStatus.useQuery(undefined, {
    enabled: !!session,
    ...WARMUP_RETRY,
  })
  const canVote = !!session && voterStatus?.allowed === true

  const {
    data: sketches,
    isLoading,
    refetch,
  } = trpc.sketch.getTwoSketches.useQuery(undefined, {
    enabled: canVote,
    ...WARMUP_RETRY,
  })
  const voteForSketchMutation = trpc.sketch.voteForSketch.useMutation()

  // Voting is always signed-in now, so progress reads straight from the durable
  // vote log — cross-device, no localStorage mirror.
  const { data: voteCount } = trpc.sketch.getMyVoteCount.useQuery(undefined, {
    enabled: canVote,
    ...WARMUP_RETRY,
  })

  // Post-vote lockout: prevents an accidental double-click from landing a stray
  // vote on the NEXT pair. The countdown ticks a visible 3…2…1 on the buttons.
  const [cooldownKey, setCooldownKey] = useState(0)
  const [coolingDown, setCoolingDown] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const timersRef = useRef<{ end?: NodeJS.Timeout; tick?: NodeJS.Timeout }>({})

  const startCooldown = useCallback(() => {
    clearTimeout(timersRef.current.end)
    clearInterval(timersRef.current.tick)
    setCooldownKey((k) => k + 1)
    setCoolingDown(true)
    setSecondsLeft(Math.ceil(VOTE_COOLDOWN_MS / 1000))
    timersRef.current.tick = setInterval(() => setSecondsLeft((s) => Math.max(1, s - 1)), 1000)
    timersRef.current.end = setTimeout(() => {
      clearInterval(timersRef.current.tick)
      setCoolingDown(false)
    }, VOTE_COOLDOWN_MS)
  }, [])

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      clearTimeout(timers.end)
      clearInterval(timers.tick)
    }
  }, [])

  const handleSkip = useCallback(() => {
    refetch()
  }, [refetch])

  const handleVote = useCallback(
    (winnerId: string, loserId: string) => {
      if (coolingDown) return
      startCooldown()
      voteForSketchMutation.mutate(
        { winnerId, loserId },
        {
          onSuccess: () => {
            utils.sketch.getMyVoteCount.invalidate()
            refetch()
          },
        }
      )
    },
    [coolingDown, startCooldown, refetch, utils.sketch.getMyVoteCount, voteForSketchMutation]
  )

  useEffect(() => {
    if (!canVote) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!sketches || sketches.length < 2) return
      if (event.key === '1') {
        handleVote(sketches[0].id, sketches[1].id)
      } else if (event.key === '2') {
        handleVote(sketches[1].id, sketches[0].id)
      } else if (event.key === 's') {
        handleSkip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [canVote, handleSkip, handleVote, sketches])

  const meta = <PageMeta title="Vote" path={ROUTES.vote} />

  if (status === 'loading' || (session && voterStatus === undefined))
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-xl text-ink/70">
        {meta}
        Loading…
      </div>
    )

  // State 1: not signed in — voting is members-only, everything else stays public.
  if (!session)
    return (
      <GateCard>
        <h1 className="mb-2 font-goofy text-2xl text-ink">Sign in to vote</h1>
        <p className="mb-6 text-ink/60">
          Votes shape the rankings, so each one is tied to an account. The{' '}
          <Link href={ROUTES.leaderboard} className="text-sky-pop hover:underline">
            leaderboard
          </Link>{' '}
          is public.
        </p>
        <button
          onClick={() => signIn('google', { callbackUrl: '/vote' })}
          className="rounded-xl bg-sky-pop px-6 py-2 font-semibold text-white transition-colors hover:bg-sky-pop-dark"
        >
          Sign in with Google
        </button>
      </GateCard>
    )

  // State 2: signed in but not yet approved — friendly ask-Dylan instruction.
  if (!voterStatus?.allowed)
    return (
      <GateCard>
        <h1 className="mb-2 font-goofy text-2xl text-ink">Almost in!</h1>
        <p className="mb-4 text-ink/60">
          Voting is invite-only to keep the rankings honest. Ask Dylan to add{' '}
          <span className="font-semibold text-ink">{session.user?.email}</span> to the voter list —
          once he does, this page unlocks automatically.
        </p>
        <a
          href={`mailto:dwheelerw@gmail.com?subject=Add me to Sketch Ranker&body=Hey Dylan — add ${session.user?.email} to the voter list!`}
          className="inline-block rounded-xl bg-sky-pop px-6 py-2 font-semibold text-white transition-colors hover:bg-sky-pop-dark"
        >
          Email Dylan
        </a>
        <p className="mt-4 text-sm text-ink/50">
          Meanwhile, the{' '}
          <Link href={ROUTES.leaderboard} className="text-sky-pop hover:underline">
            leaderboard
          </Link>{' '}
          is open to everyone.
        </p>
      </GateCard>
    )

  // State 3: approved voter.
  if (isLoading || !sketches)
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-xl text-ink/70">
        {meta}
        Loading…
      </div>
    )

  if (sketches.length < 2)
    return <div className="text-center">No sketches available. Please try again later.</div>

  return (
    <div className="flex min-h-screen flex-col items-center bg-cream">
      {meta}
      <div className="min-h-full w-full flex-1 p-4">
        <ShortcutGuide />
        <LeaderboardProgress voteCount={voteCount ?? 0} />
        {voteForSketchMutation.isError && (
          <p className="mb-2 text-center text-sm text-ketchup">
            That vote didn&apos;t save — the database may be waking up. Try again.
          </p>
        )}
        <SketchVote
          sketch1={sketches[0]}
          sketch2={sketches[1]}
          onVote={handleVote}
          onSkip={handleSkip}
          cooldownKey={cooldownKey}
          coolingDown={coolingDown}
          secondsLeft={secondsLeft}
        />
      </div>
    </div>
  )
}

export default VotePage
