-- AlterTable
ALTER TABLE "NetworkingTask" ADD COLUMN     "img_url" TEXT;

-- CreateTable
CREATE TABLE "FossibSubmission" (
    "id" SERIAL NOT NULL,
    "batch" INTEGER NOT NULL,
    "file_url" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "FossibSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FossibSubmission" ADD CONSTRAINT "FossibSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
