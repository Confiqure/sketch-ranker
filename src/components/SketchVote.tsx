import React from 'react'
import Image from 'next/image'

// Lean view type — only what the cards render (decouples the component from
// Prisma model types and their Date fields, which serialize to strings anyway).
export type SketchCardData = {
  id: string
  title: string
  collection: string | null
  description: string | null
  imageUrl?: string
}

// Double-click guard: votes lock for this long after each click. Exported so
// the page-level keyboard shortcuts enforce the same window.
export const VOTE_COOLDOWN_MS = 3000

type SketchProps = {
  sketch1: SketchCardData
  sketch2: SketchCardData
  onSkip: () => void
  // eslint-disable-next-line no-unused-vars
  onVote: (winnerId: string, loserId: string) => void
  /** Increments on every vote; > 0 and changing = a fresh cooldown is running. */
  cooldownKey: number
  coolingDown: boolean
  secondsLeft: number
  /** The next matchup is being fetched. Cards dim and inputs lock. */
  loadingNext: boolean
}

const SketchCard: React.FC<{
  sketch: SketchCardData
  onVote: () => void
  // Complete class strings — Tailwind's scanner can't see dynamically-built names
  // (the old `hover:${color.replace(...)}` hover states never actually existed).
  buttonClass: string
  tilt: string
  cooldownKey: number
  coolingDown: boolean
  secondsLeft: number
  disabled: boolean
}> = ({ sketch, onVote, buttonClass, tilt, cooldownKey, coolingDown, secondsLeft, disabled }) => (
  <div
    className={`sketch flex w-full flex-col rounded-2xl border-2 border-ink/10 bg-white p-2 text-center shadow-md transition-transform hover:-translate-y-0.5 sm:p-4 lg:p-6 ${tilt}`}
  >
    <div className="flex grow flex-col justify-center">
      {/* Side-by-side on every screen: compact type + hidden metadata on phones
          so both choices are visible together with no scrolling. */}
      <h2 className="mb-1 text-sm font-bold leading-snug text-ink sm:mb-2 sm:text-lg lg:text-2xl">
        {sketch.title}
      </h2>
      {sketch.collection && (
        <p className="mb-2 hidden text-xs italic text-ink/40 sm:mb-4 sm:block">
          {sketch.collection}
        </p>
      )}
      {sketch.imageUrl && (
        <div className="relative mb-2 h-28 w-full sm:mb-4 sm:h-48 lg:h-64">
          <Image
            src={sketch.imageUrl}
            alt={sketch.title}
            fill
            sizes="(min-width: 1024px) 28rem, 50vw"
            className="rounded-md object-cover"
          />
        </div>
      )}
      {sketch.description && (
        <p className="mb-2 hidden text-sm text-ink/60 sm:block lg:text-base">
          {sketch.description}
        </p>
      )}
    </div>
    <button
      className={`relative mt-1 w-full overflow-hidden rounded-xl py-2 text-xs font-semibold text-white transition-all sm:mt-2 sm:text-sm lg:mt-4 lg:text-base ${buttonClass} ${
        disabled ? 'cursor-not-allowed opacity-90' : 'hover:animate-wiggle'
      }`}
      onClick={onVote}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {coolingDown ? (
        <>
          {/* keyed per vote so the drain restarts cleanly each time */}
          <span
            key={cooldownKey}
            className="absolute inset-y-0 left-0 bg-white/25"
            style={{ animation: `cooldown-drain ${VOTE_COOLDOWN_MS}ms linear forwards` }}
          />
          <span className="relative">
            Locked in… <span className="font-goofy">{secondsLeft}</span>
          </span>
        </>
      ) : (
        <>
          <span className="sm:hidden">This one</span>
          <span className="hidden sm:inline">Vote for {sketch.title}</span>
        </>
      )}
    </button>
  </div>
)

const SketchVote: React.FC<SketchProps> = ({
  sketch1,
  sketch2,
  onSkip,
  onVote,
  cooldownKey,
  coolingDown,
  secondsLeft,
  loadingNext,
}) => {
  const disabled = coolingDown || loadingNext
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-2 sm:p-4 lg:p-6">
      <div className="relative w-full max-w-4xl">
        <div
          className={`flex w-full flex-row items-stretch justify-center gap-2 transition-opacity sm:gap-4 lg:gap-8 ${
            loadingNext ? 'pointer-events-none opacity-40' : ''
          }`}
        >
          <div className="flex min-w-0 flex-1 items-stretch">
            <SketchCard
              sketch={sketch1}
              onVote={() => onVote(sketch1.id, sketch2.id)}
              buttonClass="bg-sky-pop hover:bg-sky-pop-dark"
              tilt="lg:-rotate-1"
              cooldownKey={cooldownKey}
              coolingDown={coolingDown}
              secondsLeft={secondsLeft}
              disabled={disabled}
            />
          </div>
          <div className="flex items-center justify-center font-goofy text-lg text-ketchup sm:text-2xl lg:text-3xl">
            VS
          </div>
          <div className="flex min-w-0 flex-1 items-stretch">
            <SketchCard
              sketch={sketch2}
              onVote={() => onVote(sketch2.id, sketch1.id)}
              buttonClass="bg-ketchup hover:bg-ketchup-dark"
              tilt="lg:rotate-1"
              cooldownKey={cooldownKey}
              coolingDown={coolingDown}
              secondsLeft={secondsLeft}
              disabled={disabled}
            />
          </div>
        </div>
        {loadingNext && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="animate-pulse rounded-full border-2 border-ink/10 bg-white px-5 py-2 font-goofy text-sm text-ink shadow-lg">
              Next matchup…
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-center sm:mt-8">
        <button
          className="rounded-full border-2 border-ink/15 bg-white px-6 py-2 text-sm font-semibold text-ink/70 transition-colors hover:bg-cream-deep disabled:opacity-50 lg:text-base"
          onClick={onSkip}
          disabled={disabled}
        >
          Too close to call, skip it
        </button>
      </div>
    </div>
  )
}

export default SketchVote
