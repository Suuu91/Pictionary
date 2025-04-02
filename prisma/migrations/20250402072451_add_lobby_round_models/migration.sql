-- AlterTable
ALTER TABLE "User" ADD COLUMN     "drawerStatus" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lobbyId" INTEGER,
ADD COLUMN     "score" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "Lobby" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "gameStarted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameStatus" TEXT NOT NULL DEFAULT 'pending',
    "currentRoundId" INTEGER,

    CONSTRAINT "Lobby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" SERIAL NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "lobbyId" INTEGER NOT NULL,
    "roundStartTime" TIMESTAMP(3) NOT NULL,
    "roundEndTime" TIMESTAMP(3) NOT NULL,
    "roundTimeLimit" INTEGER NOT NULL,
    "roundStatus" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoundUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RoundUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RoundUsers_B_index" ON "_RoundUsers"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD CONSTRAINT "Round_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "Lobby"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoundUsers" ADD CONSTRAINT "_RoundUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoundUsers" ADD CONSTRAINT "_RoundUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
