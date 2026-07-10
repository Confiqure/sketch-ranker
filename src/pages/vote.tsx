import { useCallback, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import SketchVote from '@/components/SketchVote'
import { trpc } from '../utils/trpc'
import LeaderboardProgress from '@/components/LeaderboardProgress'
import ShortcutGuide from '@/components/ShortcutGuide'

// Friendly full-page state for the two "can't vote yet" cases.
const GateCard = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-6">
    <Head>
      <title>Vote — Comedy Sketch Ranker</title>
    </Head>
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">{children}</div>
  </div>
)

const VotePage = () => {
  const { data: session, status } = useSession()
  const utils = trpc.useUtils()
  const { data: voterStatus } = trpc.sketch.getVoterStatus.useQuery(undefined, {
    enabled: !!session,
  })
  const canVote = !!session && voterStatus?.allowed === true

  const {
    data: sketches,
    isLoading,
    refetch,
  } = trpc.sketch.getTwoSketches.useQuery(undefined, {
    enabled: canVote,
  })
  const voteForSketchMutation = trpc.sketch.voteForSketch.useMutation()

  // Voting is always signed-in now, so progress reads straight from the durable
  // vote log — cross-device, no localStorage mirror.
  const { data: voteCount } = trpc.sketch.getMyVoteCount.useQuery(undefined, {
    enabled: canVote,
  })

  const handleSkip = useCallback(() => {
    refetch()
  }, [refetch])

  const handleVote = useCallback(
    (winnerId: string, loserId: string) => {
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
    [refetch, utils.sketch.getMyVoteCount, voteForSketchMutation]
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

  if (status === 'loading' || (session && voterStatus === undefined))
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 text-xl text-gray-700">
        Loading…
      </div>
    )

  // State 1: not signed in — voting is members-only, everything else stays public.
  if (!session)
    return (
      <GateCard>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign in to vote</h1>
        <p className="text-gray-600 mb-6">
          Votes shape the rankings, so each one is tied to an account. The{' '}
          <Link href="/leaderboard" className="text-blue-600 hover:underline">
            leaderboard
          </Link>{' '}
          is public.
        </p>
        <button
          onClick={() => signIn('google', { callbackUrl: '/vote' })}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign in with Google
        </button>
      </GateCard>
    )

  // State 2: signed in but not yet approved — friendly ask-Dylan instruction.
  if (!voterStatus?.allowed)
    return (
      <GateCard>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Almost in!</h1>
        <p className="text-gray-600 mb-4">
          Voting is invite-only to keep the rankings honest. Ask Dylan to add{' '}
          <span className="font-semibold text-gray-800">{session.user?.email}</span> to the voter
          list — once he does, this page unlocks automatically.
        </p>
        <a
          href={`mailto:dwheelerw@gmail.com?subject=Add me to Sketch Ranker&body=Hey Dylan — add ${session.user?.email} to the voter list!`}
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Email Dylan
        </a>
        <p className="mt-4 text-sm text-gray-500">
          Meanwhile, the{' '}
          <Link href="/leaderboard" className="text-blue-600 hover:underline">
            leaderboard
          </Link>{' '}
          is open to everyone.
        </p>
      </GateCard>
    )

  // State 3: approved voter.
  if (isLoading || !sketches)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 text-xl text-gray-700">
        Loading…
      </div>
    )

  if (sketches.length < 2)
    return <div className="text-center">No sketches available. Please try again later.</div>

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-100 to-gray-300 flex flex-col items-center">
      <Head>
        <title>Vote — Comedy Sketch Ranker</title>
      </Head>
      <div className="flex-1 w-full min-h-full p-4 bg-white text-black rounded-md shadow-md">
        <ShortcutGuide />
        <LeaderboardProgress voteCount={voteCount ?? 0} />
        {voteForSketchMutation.isError && (
          <p className="mb-2 text-center text-sm text-red-600">
            That vote didn&apos;t save — the database may be waking up. Try again.
          </p>
        )}
        <SketchVote
          sketch1={sketches[0]}
          sketch2={sketches[1]}
          onVote={handleVote}
          onSkip={handleSkip}
        />
      </div>
    </div>
  )
}

export default VotePage
