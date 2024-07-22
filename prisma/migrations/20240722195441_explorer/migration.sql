-- AlterTable
ALTER TABLE "ConnectSubmission" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "ExplorerSubmission" (
    "id" SERIAL NOT NULL,
    "img_url" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ExplorerSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExplorerSubmission" ADD CONSTRAINT "ExplorerSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
