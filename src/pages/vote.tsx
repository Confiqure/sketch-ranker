import { useEffect, useState } from 'react'
import SketchVote from '@/components/SketchVote'
import { trpc } from '../utils/trpc'
import LeaderboardProgress from '@/components/LeaderboardProgress'

const VotePage = () => {
  const { data: sketches, isLoading, refetch } = trpc.sketch.getTwoSketches.useQuery()
  const voteForSketchMutation = trpc.sketch.voteForSketch.useMutation()

  const [skipCount, setSkipCount] = useState(0)
  const [voteCount, setVoteCount] = useState(0)

  useEffect(() => {
    const storedVoteCount = localStorage.getItem('voteCount')
    if (storedVoteCount) {
      setVoteCount(parseInt(storedVoteCount, 10))
    }
    const storedSkipCount = localStorage.getItem('skipCount')
    if (storedSkipCount) {
      setSkipCount(parseInt(storedSkipCount, 10))
    }
  }, [])

  const handleSkip = () => {
    const newSkipCount = skipCount + 1
    setSkipCount(newSkipCount)
    localStorage.setItem('skipCount', newSkipCount.toString())
    refetch()
  }

  const handleVote = (winnerId: string, loserId: string) => {
    voteForSketchMutation.mutate(
      { winnerId, loserId },
      {
        onSuccess: () => {
          const newVoteCount = voteCount + 1
          setVoteCount(newVoteCount)
          localStorage.setItem('voteCount', newVoteCount.toString())
          refetch()
        },
      }
    )
  }

  if (isLoading) return <div className="text-center">Loading...</div>

  if (!sketches || sketches.length < 2)
    return <div className="text-center">No sketches available. Please try again later.</div>

  const formattedSketches = sketches.map((sketch) => ({
    ...sketch,
    createdAt: new Date(sketch.createdAt),
    updatedAt: new Date(sketch.updatedAt),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 flex flex-col items-center">
      <div className="flex-1 w-full min-h-full p-4 bg-white text-black rounded-md shadow-md">
        <LeaderboardProgress voteCount={voteCount} />
        <SketchVote
          sketch1={formattedSketches[0]}
          sketch2={formattedSketches[1]}
          onVote={handleVote}
          onSkip={handleSkip}
        />
      </div>
    </div>
  )
}

export default VotePage
