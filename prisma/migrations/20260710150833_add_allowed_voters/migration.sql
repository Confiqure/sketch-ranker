-- CreateTable
CREATE TABLE "AllowedVoter" (
    "email" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllowedVoter_pkey" PRIMARY KEY ("email")
);
