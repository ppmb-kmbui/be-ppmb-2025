/*
  Warnings:

  - You are about to drop the column `userId` on the `NetworkingTask` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NetworkingTask" DROP CONSTRAINT "NetworkingTask_userId_fkey";

-- AlterTable
ALTER TABLE "NetworkingTask" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "batch" INTEGER NOT NULL DEFAULT 2024;
