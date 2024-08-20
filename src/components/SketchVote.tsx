import React from 'react'
import { Sketch } from '@prisma/client'
import Image from 'next/image'

type SketchProps = {
  sketch1: Sketch
  sketch2: Sketch
  // eslint-disable-next-line no-unused-vars
  onVote: (winnerId: string, loserId: string) => void
}

const SketchCard: React.FC<{ sketch: Sketch; onVote: () => void; buttonColor: string }> = ({
  sketch,
  onVote,
  buttonColor,
}) => (
  <div className="sketch bg-white p-6 rounded-lg shadow-md w-full text-center flex flex-col">
    <div className="flex-grow">
      <Image
        src={sketch.imageUrl || ''}
        alt={sketch.title}
        className="w-full h-64 object-cover rounded-md mb-4"
      />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{sketch.title}</h2>
      {sketch.description && <p className="text-gray-600 mb-2">{sketch.description}</p>}
      {sketch.collection && <p className="text-gray-400 italic mb-4">{sketch.collection}</p>}
    </div>
    <button
      className={`w-full py-2 ${buttonColor} text-white rounded-lg hover:${buttonColor.replace(
        '500',
        '600'
      )} transition-colors mt-4`}
      onClick={onVote}
    >
      Vote for {sketch.title}
    </button>
  </div>
)

const SketchVote: React.FC<SketchProps> = ({ sketch1, sketch2, onVote }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 w-full max-w-4xl">
        <div className="flex-1 flex items-stretch">
          <SketchCard
            sketch={sketch1}
            onVote={() => onVote(sketch1.id, sketch2.id)}
            buttonColor="bg-blue-500"
          />
        </div>
        <div className="flex items-center justify-center text-3xl font-bold text-gray-600">VS</div>
        <div className="flex-1 flex items-stretch">
          <SketchCard
            sketch={sketch2}
            onVote={() => onVote(sketch2.id, sketch1.id)}
            buttonColor="bg-green-500"
          />
        </div>
      </div>
    </div>
  )
}

export default SketchVote
