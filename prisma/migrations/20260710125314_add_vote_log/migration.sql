-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "winnerId" TEXT NOT NULL,
    "loserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vote_userId_idx" ON "Vote"("userId");

-- CreateIndex
CREATE INDEX "Vote_winnerId_idx" ON "Vote"("winnerId");

-- CreateIndex
CREATE INDEX "Vote_loserId_idx" ON "Vote"("loserId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Sketch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_loserId_fkey" FOREIGN KEY ("loserId") REFERENCES "Sketch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
