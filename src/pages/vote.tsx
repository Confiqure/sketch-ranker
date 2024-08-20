import SketchVote from '@/components/SketchVote'
import { trpc } from '../utils/trpc'

const VotePage = () => {
  const { data: sketches, isLoading, refetch } = trpc.sketch.getTwoSketches.useQuery()

  const voteForSketchMutation = trpc.sketch.voteForSketch.useMutation()

  const handleVote = (winnerId: string, loserId: string) => {
    voteForSketchMutation.mutate(
      { winnerId, loserId },
      {
        onSuccess: () => {
          refetch()
        },
      }
    )
  }

  if (isLoading) return <div>Loading...</div>

  if (!sketches || sketches.length < 2) return <div>No sketches available.</div>

  const formattedSketches = sketches.map((sketch) => ({
    ...sketch,
    createdAt: new Date(sketch.createdAt),
    updatedAt: new Date(sketch.updatedAt),
  }))

  return (
    <SketchVote sketch1={formattedSketches[0]} sketch2={formattedSketches[1]} onVote={handleVote} />
  )
}

export default VotePage
