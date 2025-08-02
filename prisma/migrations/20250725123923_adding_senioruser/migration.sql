/*
  Warnings:

  - You are about to drop the column `is_done` on the `NetworkingKatingTask` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NetworkingKatingTask" DROP CONSTRAINT "NetworkingKatingTask_to_id_fkey";

-- AlterTable
ALTER TABLE "NetworkingKatingTask" DROP COLUMN "is_done";

-- CreateTable
CREATE TABLE "SeniorUser" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT,
    "batch" INTEGER NOT NULL,

    CONSTRAINT "SeniorUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NetworkingKatingTask" ADD CONSTRAINT "NetworkingKatingTask_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "SeniorUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
