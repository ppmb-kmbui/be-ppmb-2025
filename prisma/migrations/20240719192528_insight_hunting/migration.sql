/*
  Warnings:

  - You are about to drop the `FossibSubmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FossibSubmission" DROP CONSTRAINT "FossibSubmission_userId_fkey";

-- DropTable
DROP TABLE "FossibSubmission";

-- CreateTable
CREATE TABLE "InsightHuntingSubmission" (
    "id" SERIAL NOT NULL,
    "file_url" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "InsightHuntingSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InsightHuntingSubmission" ADD CONSTRAINT "InsightHuntingSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
