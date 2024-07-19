-- CreateTable
CREATE TABLE "ConnectSubmission" (
    "id" SERIAL NOT NULL,
    "batch" INTEGER NOT NULL,
    "file_url" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ConnectSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ConnectSubmission" ADD CONSTRAINT "ConnectSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
