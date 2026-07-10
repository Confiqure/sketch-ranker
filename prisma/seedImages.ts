/* eslint-disable @typescript-eslint/no-require-imports */

// Seeds the sketch↔meme-image mappings from prisma/sketch_images.json — a tracked
// export of the production data (2026-07-10), so a fresh environment seeds fully
// without the long-lost Google-Drive CSV this script originally read. The image
// files themselves live in the public itysl-memes S3 bucket; only fileName rows
// are stored. Idempotent: existing fileNames are skipped.

const fs = require('fs')
const path = require('path')

interface ImageRow {
  title: string
  fileName: string
}

async function seedImages() {
  const { PrismaClient } = require('@prisma/client')
  const { PrismaPg } = require('@prisma/adapter-pg')
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  })

  try {
    const rows: ImageRow[] = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'sketch_images.json'), 'utf8')
    )

    const sketches = await prisma.sketch.findMany({ select: { id: true, title: true } })
    const idByTitle = new Map<string, string>(
      sketches.map((s: { id: string; title: string }) => [s.title, s.id])
    )
    const existing = new Set<string>(
      (await prisma.image.findMany({ select: { fileName: true } })).map(
        (i: { fileName: string }) => i.fileName
      )
    )

    const data = rows
      .filter((r) => !existing.has(r.fileName))
      .flatMap((r) => {
        const sketchId = idByTitle.get(r.title)
        if (!sketchId) {
          console.error(`Sketch not found for title: ${r.title}`)
          return []
        }
        return [{ fileName: r.fileName, sketchId }]
      })

    await prisma.image.createMany({ data })
    console.log(`Images seeded: ${data.length} added, ${existing.size} already present.`)
  } catch (error) {
    console.error('Error seeding images:', error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

seedImages().catch((e) => {
  console.error(e)
  process.exit(1)
})
