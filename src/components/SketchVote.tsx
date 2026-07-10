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
}> = ({ sketch, onVote, buttonClass, tilt, cooldownKey, coolingDown, secondsLeft }) => (
  <div
    className={`sketch flex w-full flex-col rounded-2xl border-2 border-ink/10 bg-white p-4 text-center shadow-md transition-transform hover:-translate-y-0.5 lg:p-6 ${tilt}`}
  >
    <div className="flex grow flex-col justify-center">
      <h2 className="mb-2 text-lg font-bold text-ink lg:text-2xl">{sketch.title}</h2>
      {sketch.collection && <p className="mb-4 text-xs italic text-ink/40">{sketch.collection}</p>}
      {sketch.imageUrl && (
        <div className="relative mb-4 h-48 w-full lg:h-64">
          <Image
            src={sketch.imageUrl}
            alt={sketch.title}
            fill
            sizes="(min-width: 1024px) 28rem, 100vw"
            className="rounded-md object-cover"
          />
        </div>
      )}
      {sketch.description && (
        <p className="mb-2 text-sm text-ink/60 lg:text-base">{sketch.description}</p>
      )}
    </div>
    <button
      className={`relative mt-2 w-full overflow-hidden rounded-xl py-2 text-sm font-semibold text-white transition-all lg:mt-4 lg:text-base ${buttonClass} ${
        coolingDown ? 'cursor-not-allowed opacity-90' : 'hover:animate-wiggle'
      }`}
      onClick={onVote}
      disabled={coolingDown}
      aria-disabled={coolingDown}
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
        <>Vote for {sketch.title}</>
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
}) => {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center p-4 lg:p-6">
      <div className="flex w-full max-w-4xl flex-col items-stretch justify-center gap-4 lg:flex-row lg:gap-8">
        <div className="flex flex-1 items-stretch">
          <SketchCard
            sketch={sketch1}
            onVote={() => onVote(sketch1.id, sketch2.id)}
            buttonClass="bg-sky-pop hover:bg-sky-pop-dark"
            tilt="lg:-rotate-1"
            cooldownKey={cooldownKey}
            coolingDown={coolingDown}
            secondsLeft={secondsLeft}
          />
        </div>
        <div className="flex items-center justify-center font-goofy text-2xl text-ketchup lg:text-3xl">
          VS
        </div>
        <div className="flex flex-1 items-stretch">
          <SketchCard
            sketch={sketch2}
            onVote={() => onVote(sketch2.id, sketch1.id)}
            buttonClass="bg-ketchup hover:bg-ketchup-dark"
            tilt="lg:rotate-1"
            cooldownKey={cooldownKey}
            coolingDown={coolingDown}
            secondsLeft={secondsLeft}
          />
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          className="rounded-full border-2 border-ink/15 bg-white px-6 py-2 text-sm font-semibold text-ink/70 transition-colors hover:bg-cream-deep lg:text-base"
          onClick={onSkip}
        >
          Too close to call — skip
        </button>
      </div>
    </div>
  )
}

export default SketchVote
