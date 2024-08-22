import { useEffect, useState } from 'react'
import SketchVote from '@/components/SketchVote'
import { trpc } from '../utils/trpc'
import LeaderboardProgress from '@/components/LeaderboardProgress'

const VotePage = () => {
  const { data: sketches, isLoading, refetch } = trpc.sketch.getTwoSketches.useQuery()
  const voteForSketchMutation = trpc.sketch.voteForSketch.useMutation()

  const [voteCount, setVoteCount] = useState(0)

  useEffect(() => {
    // Load vote count from local storage or set it to 0
    const storedVoteCount = localStorage.getItem('voteCount')
    if (storedVoteCount) {
      setVoteCount(parseInt(storedVoteCount, 10))
    }
  }, [])

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
        />
      </div>
    </div>
  )
}

export default VotePage
