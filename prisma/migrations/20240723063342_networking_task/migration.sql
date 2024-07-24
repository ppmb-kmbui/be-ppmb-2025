-- AlterTable
ALTER TABLE "NetworkingTask" ADD COLUMN     "description" TEXT,
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;
