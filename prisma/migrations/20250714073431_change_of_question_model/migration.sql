/*
  Warnings:

  - You are about to drop the column `is_mandatory` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `is_mandatory` on the `questions_kating` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "questions" DROP COLUMN "is_mandatory",
ADD COLUMN     "group_id" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "questions_kating" DROP COLUMN "is_mandatory",
ADD COLUMN     "group_id" INTEGER NOT NULL DEFAULT 1;
