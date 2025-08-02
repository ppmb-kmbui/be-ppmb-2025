/*
  Warnings:

  - You are about to drop the column `score` on the `NetworkingKatingTask` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `NetworkingTask` table. All the data in the column will be lost.
  - You are about to drop the `ConnectSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExplorerSubmissionScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FirstFossibSessionScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InsightHuntingSubmissionScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MentoringReflectionScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MentoringVlogSubmissionScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NetworkingTaskScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordResetToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SecondFossibSessionScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attendance_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attendances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `networking_scores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConnectSubmission" DROP CONSTRAINT "ConnectSubmission_userId_fkey";

-- DropForeignKey
ALTER TABLE "ExplorerSubmissionScore" DROP CONSTRAINT "ExplorerSubmissionScore_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "FirstFossibSessionScore" DROP CONSTRAINT "FirstFossibSessionScore_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "InsightHuntingSubmissionScore" DROP CONSTRAINT "InsightHuntingSubmissionScore_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "MentoringReflectionScore" DROP CONSTRAINT "MentoringReflectionScore_reflection_id_fkey";

-- DropForeignKey
ALTER TABLE "MentoringVlogSubmissionScore" DROP CONSTRAINT "MentoringVlogSubmissionScore_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "SecondFossibSessionScore" DROP CONSTRAINT "SecondFossibSessionScore_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "attendance_records" DROP CONSTRAINT "attendance_records_attendance_id_fkey";

-- DropForeignKey
ALTER TABLE "attendance_records" DROP CONSTRAINT "attendance_records_user_id_fkey";

-- DropForeignKey
ALTER TABLE "networking_scores" DROP CONSTRAINT "networking_scores_user_id_fkey";

-- AlterTable
ALTER TABLE "NetworkingKatingTask" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "NetworkingTask" DROP COLUMN "score";

-- DropTable
DROP TABLE "ConnectSubmission";

-- DropTable
DROP TABLE "ExplorerSubmissionScore";

-- DropTable
DROP TABLE "FirstFossibSessionScore";

-- DropTable
DROP TABLE "InsightHuntingSubmissionScore";

-- DropTable
DROP TABLE "MentoringReflectionScore";

-- DropTable
DROP TABLE "MentoringVlogSubmissionScore";

-- DropTable
DROP TABLE "NetworkingTaskScore";

-- DropTable
DROP TABLE "PasswordResetToken";

-- DropTable
DROP TABLE "SecondFossibSessionScore";

-- DropTable
DROP TABLE "attendance_records";

-- DropTable
DROP TABLE "attendances";

-- DropTable
DROP TABLE "networking_scores";
