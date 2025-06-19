/*
  Warnings:

  - You are about to drop the column `currentRoundId` on the `Lobby` table. All the data in the column will be lost.
  - You are about to drop the column `gameStarted` on the `Lobby` table. All the data in the column will be lost.
  - You are about to drop the column `gameStatus` on the `Lobby` table. All the data in the column will be lost.
  - You are about to drop the column `drawerStatus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Round` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoundUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Round" DROP CONSTRAINT "Round_lobbyId_fkey";

-- DropForeignKey
ALTER TABLE "_RoundUsers" DROP CONSTRAINT "_RoundUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoundUsers" DROP CONSTRAINT "_RoundUsers_B_fkey";

-- AlterTable
ALTER TABLE "Lobby" DROP COLUMN "currentRoundId",
DROP COLUMN "gameStarted",
DROP COLUMN "gameStatus";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "drawerStatus",
DROP COLUMN "score";

-- DropTable
DROP TABLE "Round";

-- DropTable
DROP TABLE "_RoundUsers";

-- CreateTable
CREATE TABLE "Drawing" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Drawing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Drawing" ADD CONSTRAINT "Drawing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
