/*
  Warnings:

  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Subject";

-- CreateTable
CREATE TABLE "Topic" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicSubmit" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "submittedById" INTEGER NOT NULL,
    "isApproved" BOOLEAN,

    CONSTRAINT "TopicSubmit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Topic_text_key" ON "Topic"("text");

-- AddForeignKey
ALTER TABLE "TopicSubmit" ADD CONSTRAINT "TopicSubmit_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
