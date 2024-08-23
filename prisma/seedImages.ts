/* eslint-disable @typescript-eslint/no-require-imports */

/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')

const IMAGES_DIR = path.join(__dirname, '../public/images/sketches/')

interface CsvRow {
  Title: string
  Page: string
  Link: string
}

async function seedImages() {
  const { PrismaClient } = require('@prisma/client')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { Sketch } = require('@prisma/client')

  const prisma = new PrismaClient()

  try {
    const sketchesMap = new Map<string, string>()

    const sketches = await prisma.sketch.findMany()
    sketches.forEach((sketch: typeof Sketch) => {
      sketchesMap.set(sketch.title, sketch.id)
    })

    const results: CsvRow[] = []
    fs.createReadStream('prisma/sketch_images_map.csv')
      .pipe(csv())
      .on('data', (data: CsvRow) => results.push(data))
      .on('end', async () => {
        for (const row of results) {
          const { Title, Link } = row
          const imageName = Link.split('id=')[1] + '.jpg'
          const imagePath = path.join(IMAGES_DIR, imageName)

          if (fs.existsSync(imagePath)) {
            const sketchId = sketchesMap.get(Title)
            if (sketchId) {
              await prisma.image.create({
                data: {
                  fileName: imageName,
                  sketchId,
                },
              })
            } else {
              console.error(`Sketch not found for title: ${Title}`)
            }
          } else {
            console.error(`Image not found: ${imagePath}`)
          }
        }
        console.log('Images have been successfully loaded into the database.')
      })
  } catch (error) {
    console.error('Error seeding images:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedImages().catch((e) => {
  console.error(e)
  process.exit(1)
})
