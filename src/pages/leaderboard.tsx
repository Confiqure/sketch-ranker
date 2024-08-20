import { trpc } from '../utils/trpc'

const LeaderboardPage = () => {
  const { data: sketches, isLoading } = trpc.sketch.getTopSketches.useQuery()

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 text-xl text-gray-700">
        Loading...
      </div>
    )

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Leaderboard</h1>
        <ul className="space-y-6">
          {sketches?.map((sketch, index) => (
            <li
              key={sketch.id}
              className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center">
                <span className="text-lg font-semibold text-gray-800 lg:mr-4">
                  {index + 1}. {sketch.title}
                </span>
                <span className="text-sm text-gray-600">{sketch.description}</span>
              </div>
              <span className="mt-2 lg:mt-0 text-lg font-medium text-gray-600">
                {sketch.rating.toFixed(1)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LeaderboardPage
