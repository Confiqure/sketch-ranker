// Shared Elo math — the single source for BOTH the global ratings (voteForSketch)
// and the per-user personal rankings (getMyLeaderboard), so the two can never
// drift apart in K-factor or formula.

export const STARTING_RATING = 1000
export const K_FACTOR = 32

export const expectedScore = (rating: number, opponentRating: number) =>
  1 / (1 + 10 ** ((opponentRating - rating) / 400))

/** New (winner, loser) ratings after one head-to-head result. */
export const eloUpdate = (winnerRating: number, loserRating: number): [number, number] => [
  winnerRating + K_FACTOR * (1 - expectedScore(winnerRating, loserRating)),
  loserRating + K_FACTOR * (0 - expectedScore(loserRating, winnerRating)),
]

export type PersonalStanding = {
  sketchId: string
  rating: number
  wins: number
  losses: number
}

/**
 * Replay a user's vote history (oldest first) into their personal Elo table.
 *
 * Every sketch the user has ever voted on starts at STARTING_RATING and only
 * THEIR votes move it — the result is "your taste, ranked", independent of the
 * crowd. Pure function over the durable Vote log, so it needs no schema or
 * denormalized state: a few hundred votes replay in microseconds.
 */
export const replayPersonalElo = (
  votes: ReadonlyArray<{ winnerId: string; loserId: string }>
): PersonalStanding[] => {
  const table = new Map<string, PersonalStanding>()
  const entry = (sketchId: string) => {
    let row = table.get(sketchId)
    if (!row) {
      row = { sketchId, rating: STARTING_RATING, wins: 0, losses: 0 }
      table.set(sketchId, row)
    }
    return row
  }

  for (const { winnerId, loserId } of votes) {
    const winner = entry(winnerId)
    const loser = entry(loserId)
    const [newWinner, newLoser] = eloUpdate(winner.rating, loser.rating)
    winner.rating = newWinner
    winner.wins += 1
    loser.rating = newLoser
    loser.losses += 1
  }

  return [...table.values()].sort((a, b) => b.rating - a.rating)
}
