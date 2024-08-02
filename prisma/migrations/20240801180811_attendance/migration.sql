/*
  Warnings:

  - You are about to drop the column `evaluation` on the `attendance_records` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendance_records" DROP COLUMN "evaluation",
ADD COLUMN     "q1" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "q2" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "q3" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "q4" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "q5" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "attendances" ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
