/*
  Warnings:

  - The primary key for the `SavedQuote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author` on the `SavedQuote` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SavedQuote` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `SavedQuote` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - The primary key for the `WhyStatement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `WhyStatement` table. All the data in the column will be lost.
  - The required column `savedQuoteId` was added to the `SavedQuote` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `title` to the `SavedQuote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `importance` to the `WhyStatement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `WhyStatement` table without a default value. This is not possible if the table is not empty.
  - The required column `whyStatementId` was added to the `WhyStatement` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('VERY_GOOD', 'GOOD', 'OK', 'BAD', 'VERY_BAD');

-- CreateEnum
CREATE TYPE "Importance" AS ENUM ('GOAL', 'HIGH', 'MEDIUM', 'SMALL');

-- AlterTable
ALTER TABLE "SavedQuote" DROP CONSTRAINT "SavedQuote_pkey",
DROP COLUMN "author",
DROP COLUMN "createdAt",
DROP COLUMN "id",
ADD COLUMN     "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "savedQuoteId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD CONSTRAINT "SavedQuote_pkey" PRIMARY KEY ("savedQuoteId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActive",
ADD COLUMN     "occupation" TEXT DEFAULT '',
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WhyStatement" DROP CONSTRAINT "WhyStatement_pkey",
DROP COLUMN "id",
ADD COLUMN     "importance" "Importance" NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "whyStatementId" TEXT NOT NULL,
ADD CONSTRAINT "WhyStatement_pkey" PRIMARY KEY ("whyStatementId");

-- CreateTable
CREATE TABLE "Personality" (
    "personalityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Personality_pkey" PRIMARY KEY ("personalityId")
);

-- CreateTable
CREATE TABLE "FistBump" (
    "fistBumpId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mood" "Mood" NOT NULL,
    "note" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FistBump_pkey" PRIMARY KEY ("fistBumpId")
);

-- CreateTable
CREATE TABLE "_PersonalityToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PersonalityToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "FistBump_userId_idx" ON "FistBump"("userId");

-- CreateIndex
CREATE INDEX "_PersonalityToUser_B_index" ON "_PersonalityToUser"("B");

-- AddForeignKey
ALTER TABLE "FistBump" ADD CONSTRAINT "FistBump_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalityToUser" ADD CONSTRAINT "_PersonalityToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Personality"("personalityId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalityToUser" ADD CONSTRAINT "_PersonalityToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
