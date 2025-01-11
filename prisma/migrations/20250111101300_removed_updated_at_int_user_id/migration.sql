/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The `userId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `_PersonalityToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `userId` on the `FistBump` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `SavedQuote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `WhyStatement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_PersonalityToUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "FistBump" DROP CONSTRAINT "FistBump_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavedQuote" DROP CONSTRAINT "SavedQuote_userId_fkey";

-- DropForeignKey
ALTER TABLE "WhyStatement" DROP CONSTRAINT "WhyStatement_userId_fkey";

-- DropForeignKey
ALTER TABLE "_PersonalityToUser" DROP CONSTRAINT "_PersonalityToUser_B_fkey";

-- AlterTable
ALTER TABLE "FistBump" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SavedQuote" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "WhyStatement" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_PersonalityToUser" DROP CONSTRAINT "_PersonalityToUser_AB_pkey",
DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL,
ADD CONSTRAINT "_PersonalityToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateIndex
CREATE INDEX "FistBump_userId_idx" ON "FistBump"("userId");

-- CreateIndex
CREATE INDEX "SavedQuote_userId_idx" ON "SavedQuote"("userId");

-- CreateIndex
CREATE INDEX "User_userId_idx" ON "User"("userId");

-- CreateIndex
CREATE INDEX "WhyStatement_userId_idx" ON "WhyStatement"("userId");

-- CreateIndex
CREATE INDEX "_PersonalityToUser_B_index" ON "_PersonalityToUser"("B");

-- AddForeignKey
ALTER TABLE "WhyStatement" ADD CONSTRAINT "WhyStatement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedQuote" ADD CONSTRAINT "SavedQuote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FistBump" ADD CONSTRAINT "FistBump_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonalityToUser" ADD CONSTRAINT "_PersonalityToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
