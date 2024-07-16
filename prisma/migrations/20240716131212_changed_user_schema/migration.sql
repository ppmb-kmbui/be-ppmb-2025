/*
  Warnings:

  - You are about to drop the column `from` on the `connection_requests` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `connection_requests` table. All the data in the column will be lost.
  - You are about to drop the column `networkingQuestionSetId` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the `networking_question_set_submissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `networking_question_sets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `networking_question_submissions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `from_id` to the `connection_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_id` to the `connection_requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "networking_question_set_submissions" DROP CONSTRAINT "networking_question_set_submissions_networkingQuestionSetI_fkey";

-- DropForeignKey
ALTER TABLE "networking_question_submissions" DROP CONSTRAINT "networking_question_submissions_question_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_networkingQuestionSetId_fkey";

-- AlterTable
ALTER TABLE "connection_requests" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "from_id" INTEGER NOT NULL,
ADD COLUMN     "to_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "networkingQuestionSetId";

-- DropTable
DROP TABLE "networking_question_set_submissions";

-- DropTable
DROP TABLE "networking_question_sets";

-- DropTable
DROP TABLE "networking_question_submissions";

-- CreateTable
CREATE TABLE "NetworkingTask" (
    "from_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,
    "task" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "NetworkingTask_pkey" PRIMARY KEY ("from_id","to_id")
);

-- AddForeignKey
ALTER TABLE "connection_requests" ADD CONSTRAINT "connection_requests_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection_requests" ADD CONSTRAINT "connection_requests_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkingTask" ADD CONSTRAINT "NetworkingTask_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkingTask" ADD CONSTRAINT "NetworkingTask_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkingTask" ADD CONSTRAINT "NetworkingTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
