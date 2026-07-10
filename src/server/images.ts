import type { PrismaClient } from '@prisma/client'

// Single home for the meme-image CDN base and the "random still per sketch"
// behavior shared by the vote pair, the podium, and the leaderboards.
export const S3_BASE_URL = 'https://itysl-memes.s3.amazonaws.com/'

/**
 * Attach a randomly-picked image URL to each sketch (one images query total).
 * The random pick per render keeps every surface feeling alive — the same
 * sketch shows a different still on the podium than it did on the vote card.
 */
export const attachRandomImages = async <T extends { id: string }>(
  prisma: PrismaClient,
  sketches: T[]
): Promise<(T & { imageUrl?: string })[]> => {
  if (sketches.length === 0) return []
  const images = await prisma.image.findMany({
    where: { sketchId: { in: sketches.map((s) => s.id) } },
    select: { sketchId: true, fileName: true },
  })
  return sketches.map((sketch) => {
    const candidates = images.filter((img) => img.sketchId === sketch.id)
    const pick = candidates[Math.floor(Math.random() * candidates.length)]
    return { ...sketch, ...(pick ? { imageUrl: `${S3_BASE_URL}${pick.fileName}` } : {}) }
  })
}
