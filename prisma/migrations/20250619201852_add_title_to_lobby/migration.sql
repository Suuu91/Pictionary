/*
  Warnings:

  - You are about to drop the column `title` on the `Drawing` table. All the data in the column will be lost.
  - Added the required column `name` to the `Drawing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Drawing" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lobby" ADD COLUMN     "title" TEXT;
