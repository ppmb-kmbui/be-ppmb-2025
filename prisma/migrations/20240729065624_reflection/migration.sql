/*
  Warnings:

  - You are about to drop the column `description` on the `NetworkingTask` table. All the data in the column will be lost.
  - You are about to drop the `FirstMentoringReflection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FourthMentoringReflection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SecondMentoringReflection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ThirdMentoringReflection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FirstMentoringReflection" DROP CONSTRAINT "FirstMentoringReflection_userId_fkey";

-- DropForeignKey
ALTER TABLE "FourthMentoringReflection" DROP CONSTRAINT "FourthMentoringReflection_userId_fkey";

-- DropForeignKey
ALTER TABLE "SecondMentoringReflection" DROP CONSTRAINT "SecondMentoringReflection_userId_fkey";

-- DropForeignKey
ALTER TABLE "ThirdMentoringReflection" DROP CONSTRAINT "ThirdMentoringReflection_userId_fkey";

-- AlterTable
ALTER TABLE "NetworkingTask" DROP COLUMN "description";

-- DropTable
DROP TABLE "FirstMentoringReflection";

-- DropTable
DROP TABLE "FourthMentoringReflection";

-- DropTable
DROP TABLE "SecondMentoringReflection";

-- DropTable
DROP TABLE "ThirdMentoringReflection";

-- CreateTable
CREATE TABLE "MentoringReflection" (
    "id" SERIAL NOT NULL,
    "file_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "MentoringReflection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MentoringReflection" ADD CONSTRAINT "MentoringReflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
