import React from 'react'
import Image from 'next/image'
import type { SketchCardData } from './SketchVote'

// Classic podium: 1st center + largest, 2nd left, 3rd right — with each
// sketch's randomly-picked still (same treatment as the vote cards) so the
// standings feel alive. Reused by the landing page and anywhere top-3 shows.

type PodiumSketch = SketchCardData & { rating: number }

const PLACES = [
  // Render order is 2nd, 1st, 3rd so first place sits in the middle.
  { rank: 2, medal: '🥈', block: 'h-16 bg-cream-deep', card: 'sm:mt-10', img: 'h-28 sm:h-32' },
  { rank: 1, medal: '🥇', block: 'h-28 bg-mustard', card: '', img: 'h-36 sm:h-48' },
  { rank: 3, medal: '🥉', block: 'h-10 bg-cream-deep', card: 'sm:mt-16', img: 'h-24 sm:h-28' },
] as const

const PodiumSpot: React.FC<{
  sketch: PodiumSketch
  place: (typeof PLACES)[number]
}> = ({ sketch, place }) => (
  <li className={`flex flex-col justify-end ${place.card}`}>
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
  const byRank = [top[1], top[0], top[2]]
  return (
    <ol className="grid items-end gap-3 sm:grid-cols-3">
      {PLACES.map((place, i) => (
        <PodiumSpot key={byRank[i].id} sketch={byRank[i]} place={place} />
      ))}
    </ol>
  )
}

export default Podium
