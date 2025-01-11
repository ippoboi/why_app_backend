/*
  Warnings:

  - You are about to drop the `Temp_code` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Temp_code";

-- CreateTable
CREATE TABLE "TempCode" (
    "codeId" SERIAL NOT NULL,
    "code" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TempCode_pkey" PRIMARY KEY ("codeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempCode_userId_key" ON "TempCode"("userId");

-- CreateIndex
CREATE INDEX "TempCode_userId_idx" ON "TempCode"("userId");

-- AddForeignKey
ALTER TABLE "TempCode" ADD CONSTRAINT "TempCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
