import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import Link from 'next/link'

const VOTE_THRESHOLD = 20
const LEVEL_THRESHOLD = 23

const calculateLevel = (votes: number) => {
  const exponent = 1.5
  return Math.floor(Math.pow(votes, 1 / exponent))
}

const calculateNextLevelVotes = (level: number) => {
  const exponent = 1.5
  return Math.pow(level + 1, exponent)
}

const LeaderboardProgress = ({ voteCount }: { voteCount: number }) => {
  const level = calculateLevel(voteCount)
  const nextLevelVotes = Math.floor(calculateNextLevelVotes(level))
  const previousLevelVotes = Math.floor(calculateNextLevelVotes(level - 1))
  const currentLevelProgress =
    ((voteCount - previousLevelVotes) / (nextLevelVotes - previousLevelVotes)) * 100
  const thresholdProgress = Math.min((voteCount / VOTE_THRESHOLD) * 100, 100)

  const isLevelComplete = voteCount >= nextLevelVotes

  useEffect(() => {
    if (voteCount > LEVEL_THRESHOLD && isLevelComplete) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      })
    }
  }, [isLevelComplete, voteCount])

  return (
    <div className="flex flex-col mb-4 text-center">
      {voteCount <= LEVEL_THRESHOLD ? (
        <>
          <p className="text-lg font-medium mb-2">
            {voteCount < VOTE_THRESHOLD
              ? `You need ${VOTE_THRESHOLD - voteCount} more votes to unlock the leaderboard.`
              : `Congratulations! You've unlocked the leaderboard!`}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-5 relative">
            <div
              className="bg-blue-600 h-5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${thresholdProgress}%` }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-white text-sm">
                {thresholdProgress.toFixed(0)}%
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-lg font-medium mb-2">
            {isLevelComplete ? `Level ${level + 1}` : `Level ${level}`}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-5 relative">
            <div
              className={`h-5 rounded-full transition-all duration-500 ease-in-out ${
                isLevelComplete ? 'bg-gray-400' : 'bg-green-600'
              }`}
              style={{ width: `${isLevelComplete ? 0 : currentLevelProgress}%` }}
            >
              <span
                className={`absolute inset-0 flex items-center justify-center text-sm ${currentLevelProgress < 50 || currentLevelProgress == 100 ? 'text-black' : 'text-white'}`}
              >
                {isLevelComplete ? `0%` : `${currentLevelProgress.toFixed(0)}%`}
              </span>
            </div>
          </div>
          <p className="text-sm mt-2">
            {voteCount} /{' '}
            {isLevelComplete ? Math.floor(calculateNextLevelVotes(level + 1)) : nextLevelVotes}{' '}
            votes to reach Level {isLevelComplete ? level + 2 : level + 1}
          </p>
        </>
      )}
      {voteCount >= VOTE_THRESHOLD && (
        <div className="mt-4">
          <Link href="/leaderboard" className="text-gray-600 underline">
            View Leaderboard
          </Link>
        </div>
      )}
    </div>
  )
}

export default LeaderboardProgress
