/*
  Warnings:

  - You are about to drop the `SeniorUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "NetworkingKatingTask" DROP CONSTRAINT "NetworkingKatingTask_to_id_fkey";

-- DropTable
DROP TABLE "SeniorUser";

-- CreateTable
CREATE TABLE "senior_users" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT,
    "batch" INTEGER NOT NULL,

    CONSTRAINT "senior_users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NetworkingKatingTask" ADD CONSTRAINT "NetworkingKatingTask_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "senior_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
