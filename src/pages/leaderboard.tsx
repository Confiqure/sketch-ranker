import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { trpc, WARMUP_RETRY } from '../utils/trpc'
import { useState, useEffect } from 'react'
import PageMeta from '@/components/PageMeta'
import { COPY, ROUTES } from '@/site.config'

const PERSONAL_MEDALS = ['🥇', '🥈', '🥉'] as const

const LeaderboardPage = () => {
  const { data: session } = useSession()
  const [showScroll, setShowScroll] = useState(false)
  const [take, setTake] = useState(25)
  // Render straight from the query — no mirrored state, no date juggling.
  const { data: sketches, isLoading } = trpc.sketch.getTopSketches.useQuery({ take }, WARMUP_RETRY)
  // The signed-in caller's top-3 taste, replayed from their own votes — bridges
  // "the crowd's ranking" to "YOUR ranking" with a medal on matching rows.
  const { data: myBoard } = trpc.sketch.getMyLeaderboard.useQuery(
    { take: 3 },
    { enabled: !!session, ...WARMUP_RETRY }
  )
  const myMedals = new Map(myBoard?.entries.map((e, i) => [e.sketchId, PERSONAL_MEDALS[i]]) ?? [])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewAll = () => setTake(0)

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.scrollY > 300) {
        setShowScroll(true)
      } else if (showScroll && window.scrollY <= 300) {
        setShowScroll(false)
      }
    }

    window.addEventListener('scroll', checkScrollTop)
    return () => {
      window.removeEventListener('scroll', checkScrollTop)
    }
  }, [showScroll])

  const meta = (
    <PageMeta
      title="Leaderboard"
      path={ROUTES.leaderboard}
      description="The definitive crowd-voted ranking of every I Think You Should Leave sketch, live."
    />
  )

  if (isLoading && !sketches)
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-xl text-ink/70">
        {meta}
        {COPY.warming}
      </div>
    )

  return (
    <div className="flex min-h-screen flex-col items-center bg-cream p-6">
      {meta}
      <div className="w-full max-w-4xl rounded-2xl border-2 border-ink/10 bg-white p-8 shadow-md">
        <h1 className="mb-2 text-center font-goofy text-3xl text-ink">Leaderboard</h1>
        <p className="mb-6 text-center text-sm text-ink/50">
          The crowd has spoken{myMedals.size > 0 && '. Medals mark your personal top 3'}.
        </p>
        <ul className="space-y-4">
          {sketches?.map((sketch, index) => (
            <li
              key={sketch.id}
              className={`flex items-center gap-4 rounded-xl border border-ink/5 bg-cream/60 p-3 shadow-sm transition-shadow hover:shadow-md ${
                index < 3 ? 'border-mustard/40 bg-mustard/10' : ''
              }`}
            >
              <span className="w-8 shrink-0 text-right font-goofy text-lg text-ink/70">
                {index + 1}
              </span>
              {sketch.imageUrl && (
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={sketch.imageUrl}
                    alt={sketch.title}
                    fill
                    sizes="5rem"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-ink">
                  {sketch.title}
                  {myMedals.has(sketch.id) && (
                    <span
                      className="ml-2"
                      title={`Your personal #${PERSONAL_MEDALS.indexOf(myMedals.get(sketch.id)!) + 1}`}
                    >
                      {myMedals.get(sketch.id)}
                    </span>
                  )}
                </span>
                {sketch.description && (
                  <p className="truncate text-sm text-ink/50">{sketch.description}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <span className="text-lg font-medium text-ink/80">{sketch.rating.toFixed(1)}</span>
                <p className="text-xs text-ink/40">
                  {sketch._count.votesWon}W–{sketch._count.votesLost}L
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {take !== 0 && (
        <button
          onClick={handleViewAll}
          className="mt-6 rounded-xl bg-sky-pop px-4 py-2 font-semibold text-white transition-colors hover:bg-sky-pop-dark"
        >
          View All
        </button>
      )}

      {showScroll && (
        <button
          onClick={scrollTop}
          className="fixed bottom-10 right-10 rounded-full bg-sky-pop px-4 py-2 font-semibold text-white shadow-lg transition-colors hover:bg-sky-pop-dark"
        >
          ↑ Scroll to Top
        </button>
      )}
    </div>
  )
}

export default LeaderboardPage
