import { useState, useEffect, useCallback } from 'react'

const ShortcutGuide = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = useCallback(() => {
    setIsVisible(!isVisible)
  }, [isVisible])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?') {
        toggleVisibility()
      } else if (event.key === 'Escape') {
        setIsVisible(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [toggleVisibility])

  return (
    <div className="relative">
      <button
        className="fixed bottom-3 left-3 p-2 lg:p-3 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 lg:text-2xl text-white rounded-full shadow-lg transition duration-300 ease-in-out"
        onClick={toggleVisibility}
        aria-label="Toggle Shortcut Guide"
      >
        ?
      </button>
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full transition-transform transform scale-95 md:scale-100 duration-300 ease-out">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Keyboard Shortcuts</h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <strong className="text-gray-700">?:</strong>
                <span className="text-gray-600">Toggle this guide</span>
              </li>
              <li className="flex justify-between">
                <strong className="text-gray-700">1:</strong>
                <span className="text-gray-600">Vote for the first sketch</span>
              </li>
              <li className="flex justify-between">
                <strong className="text-gray-700">2:</strong>
                <span className="text-gray-600">Vote for the second sketch</span>
              </li>
              <li className="flex justify-between">
                <strong className="text-gray-700">S:</strong>
                <span className="text-gray-600">Skip to the next pair</span>
              </li>
              <li className="flex justify-between">
                <strong className="text-gray-700">Esc:</strong>
                <span className="text-gray-600">Close this guide</span>
              </li>
            </ul>
            <button
              className="mt-6 p-2 bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 text-white rounded-md w-full transition duration-300 ease-in-out"
              onClick={toggleVisibility}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShortcutGuide
