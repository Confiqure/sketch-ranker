-- CreateTable
CREATE TABLE "Sketch" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "collection" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 1000.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sketch_pkey" PRIMARY KEY ("id")
);
