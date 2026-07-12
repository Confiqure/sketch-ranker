import React from 'react'
import Image from 'next/image'
import type { SketchCardData } from './SketchVote'

// Classic podium: 1st center + largest, 2nd left, 3rd right on desktop. DOM
// order is 1st → 2nd → 3rd (so the mobile stack and the <ol> semantics read
// in rank order); CSS `sm:order-*` does the center-first shuffle on wide
// screens only.

type PodiumSketch = SketchCardData & { rating: number }

const PLACES = [
  {
    rank: 1,
    medal: '🥇',
    order: 'sm:order-2',
    block: 'h-28 bg-mustard',
    card: '',
    img: 'h-36 sm:h-48',
  },
  {
    rank: 2,
    medal: '🥈',
    order: 'sm:order-1',
    block: 'h-16 bg-cream-deep',
    card: 'sm:mt-10',
    img: 'h-28 sm:h-32',
  },
  {
    rank: 3,
    medal: '🥉',
    order: 'sm:order-3',
    block: 'h-10 bg-cream-deep',
    card: 'sm:mt-16',
    img: 'h-24 sm:h-28',
  },
] as const

const PodiumSpot: React.FC<{
  sketch: PodiumSketch
  place: (typeof PLACES)[number]
}> = ({ sketch, place }) => (
  <li className={`flex flex-col justify-end ${place.order} ${place.card}`}>
    <div
      className={`flex flex-col rounded-2xl border-2 border-ink/10 bg-white p-3 text-center shadow-md transition-transform hover:-translate-y-1 hover:animate-wiggle ${
        place.rank === 1 ? 'ring-4 ring-mustard/60' : ''
      }`}
    >
      <span className={place.rank === 1 ? 'text-4xl' : 'text-2xl'}>{place.medal}</span>
      {sketch.imageUrl && (
        <div className={`relative mt-2 w-full ${place.img}`}>
          <Image
            src={sketch.imageUrl}
            alt={sketch.title}
            fill
            sizes="(min-width: 640px) 20rem, 100vw"
            className="rounded-lg object-cover"
          />
        </div>
      )}
      <p
        className={`mt-2 font-semibold text-ink ${place.rank === 1 ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}
      >
        {sketch.title}
      </p>
      <p className="text-sm text-ink/50">{sketch.rating.toFixed(1)}</p>
    </div>
    <div className={`mx-4 mt-2 rounded-t-lg ${place.block}`} />
  </li>
)

const Podium: React.FC<{ top: PodiumSketch[] }> = ({ top }) => {
  if (top.length < 3) return null
  return (
    <ol className="grid items-end gap-3 sm:grid-cols-3">
      {PLACES.map((place, i) => (
        <PodiumSpot key={top[i].id} sketch={top[i]} place={place} />
      ))}
    </ol>
  )
}

/** Pulsing stand-in while the database wakes from its 0-ACU nap — keeps the
 *  podium section visible (and the layout stable) instead of vanishing. */
export const PodiumSkeleton: React.FC = () => (
  <div>
    <ol className="grid animate-pulse items-end gap-3 sm:grid-cols-3">
      {PLACES.map((place) => (
        <li key={place.rank} className={`flex flex-col justify-end ${place.order} ${place.card}`}>
          <div className="flex flex-col items-center rounded-2xl border-2 border-ink/10 bg-white p-3">
            <span className={`${place.rank === 1 ? 'text-4xl' : 'text-2xl'} opacity-40`}>
              {place.medal}
            </span>
            <div className={`mt-2 w-full rounded-lg bg-cream-deep ${place.img}`} />
            <div className="mt-3 h-4 w-2/3 rounded bg-cream-deep" />
            <div className="mt-2 h-3 w-1/3 rounded bg-cream-deep" />
          </div>
          <div className={`mx-4 mt-2 rounded-t-lg opacity-60 ${place.block}`} />
        </li>
      ))}
    </ol>
    <p className="mt-4 text-center text-sm text-ink/50">
      Waking up the scoreboard… it&apos;s doing its best.
    </p>
  </div>
)

export default Podium
