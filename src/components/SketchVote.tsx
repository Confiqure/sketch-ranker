import React from 'react'
import { SketchWithImage } from '@/server/routers/sketchRouter'

type SketchProps = {
  sketch1: SketchWithImage
  sketch2: SketchWithImage
  onSkip: () => void
  // eslint-disable-next-line no-unused-vars
  onVote: (winnerId: string, loserId: string) => void
}

const SketchCard: React.FC<{
  sketch: SketchWithImage
  onVote: () => void
  buttonColor: string
}> = ({ sketch, onVote, buttonColor }) => (
  <div className="sketch flex flex-col bg-white p-4 lg:p-6 rounded-lg shadow-md w-full text-center">
    <div className="flex-grow flex flex-col justify-center">
      <h2 className="text-lg lg:text-2xl font-bold text-gray-800 mb-2">{sketch.title}</h2>
      {sketch.collection && (
        <p className="text-gray-400 italic mb-4 text-2xs lg:text-xs">{sketch.collection}</p>
      )}
      {sketch.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sketch.imageUrl}
          alt={sketch.title}
          className="w-full h-48 lg:h-64 object-cover rounded-md mb-4"
        />
      )}
      {sketch.description && (
        <p className="text-gray-600 mb-2 text-sm lg:text-base">{sketch.description}</p>
      )}
    </div>
    <button
      className={`w-full py-2 ${buttonColor} text-white rounded-lg hover:${buttonColor.replace(
        '500',
        '600'
      )} transition-colors mt-2 lg:mt-4 text-sm lg:text-base`}
      onClick={onVote}
    >
      Vote for {sketch.title}
    </button>
  </div>
)

const SketchVote: React.FC<SketchProps> = ({ sketch1, sketch2, onSkip, onVote }) => {
  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center bg-gray-100 p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row justify-center items-stretch gap-4 lg:gap-8 w-full max-w-4xl">
        <div className="flex-1 flex items-stretch">
          <SketchCard
            sketch={sketch1}
            onVote={() => onVote(sketch1.id, sketch2.id)}
            buttonColor="bg-blue-500"
          />
        </div>
        <div className="flex items-center justify-center text-2xl lg:text-3xl font-bold text-gray-600">
          VS
        </div>
        <div className="flex-1 flex items-stretch">
          <SketchCard
            sketch={sketch2}
            onVote={() => onVote(sketch2.id, sketch1.id)}
            buttonColor="bg-green-500"
          />
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors text-sm lg:text-base"
          onClick={onSkip}
        >
          Skip
        </button>
      </div>
    </div>
  )
}

export default SketchVote
