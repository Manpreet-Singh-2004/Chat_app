/*
  Warnings:

  - A unique constraint covering the columns `[dmKey]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ChatStatus" AS ENUM ('INVITED', 'ACTIVE', 'DECLINED');

-- CreateEnum
CREATE TYPE "ChatUserStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "dmKey" TEXT,
ADD COLUMN     "invitedByUserId" TEXT,
ADD COLUMN     "status" "ChatStatus" NOT NULL DEFAULT 'INVITED';

-- AlterTable
ALTER TABLE "ChatUser" ADD COLUMN     "status" "ChatUserStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX "Chat_dmKey_key" ON "Chat"("dmKey");
