import { trpc } from '../utils/trpc'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const LeaderboardPage = () => {
  const router = useRouter()
  const [take, setTake] = useState(25)
  const [showScroll, setShowScroll] = useState(false)
  const { data: sketches, refetch, isLoading } = trpc.sketch.getTopSketches.useQuery({ take })

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewAll = () => {
    setTake(0)
    refetch()
  }

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.scrollY > 300) {
        setShowScroll(true)
      } else if (showScroll && window.scrollY <= 300) {
        setShowScroll(false)
      }
    }

    window.addEventListener('scroll', checkScrollTop)
    return () => {
      window.removeEventListener('scroll', checkScrollTop)
    }
  }, [showScroll])

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100 text-xl text-gray-700">
        Loading...
      </div>
    )

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <button
        onClick={() => router.push('/vote')}
        className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg mb-6 hover:bg-blue-600 transition-colors"
      >
        Back to Voting
      </button>

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

      {take !== 0 && (
        <button
          onClick={handleViewAll}
          className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg mt-6 hover:bg-blue-600 transition-colors"
        >
          View All
        </button>
      )}

      {showScroll && (
        <button
          onClick={scrollTop}
          className="fixed bottom-10 right-10 bg-blue-500 text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          ↑ Scroll to Top
        </button>
      )}
    </div>
  )
}

export default LeaderboardPage
