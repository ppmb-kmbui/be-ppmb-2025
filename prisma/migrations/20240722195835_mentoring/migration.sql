-- CreateTable
CREATE TABLE "FirstMentoringReflection" (
    "id" SERIAL NOT NULL,
    "file_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "FirstMentoringReflection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecondMentoringReflection" (
    "id" SERIAL NOT NULL,
    "file_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SecondMentoringReflection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThirdMentoringReflection" (
    "id" SERIAL NOT NULL,
    "file_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ThirdMentoringReflection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FourthMentoringReflection" (
    "id" SERIAL NOT NULL,
    "file_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "FourthMentoringReflection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentoringVlogSubmission" (
    "id" SERIAL NOT NULL,
    "file_url" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "MentoringVlogSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FirstMentoringReflection" ADD CONSTRAINT "FirstMentoringReflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecondMentoringReflection" ADD CONSTRAINT "SecondMentoringReflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThirdMentoringReflection" ADD CONSTRAINT "ThirdMentoringReflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FourthMentoringReflection" ADD CONSTRAINT "FourthMentoringReflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentoringVlogSubmission" ADD CONSTRAINT "MentoringVlogSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
