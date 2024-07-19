-- CreateTable
CREATE TABLE "FirstFossibSessionSubmission" (
    "id" SERIAL NOT NULL,
    "file_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "FirstFossibSessionSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecondFossibSessionSubmission" (
    "id" SERIAL NOT NULL,
    "file_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SecondFossibSessionSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FirstFossibSessionSubmission" ADD CONSTRAINT "FirstFossibSessionSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecondFossibSessionSubmission" ADD CONSTRAINT "SecondFossibSessionSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
