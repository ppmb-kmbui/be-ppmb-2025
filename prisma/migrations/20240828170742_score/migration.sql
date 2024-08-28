-- CreateTable
CREATE TABLE "NetworkingTaskScore" (
    "from_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "NetworkingTaskScore_pkey" PRIMARY KEY ("from_id","to_id")
);

-- CreateTable
CREATE TABLE "FirstFossibSessionScore" (
    "id" SERIAL NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "FirstFossibSessionScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecondFossibSessionScore" (
    "id" SERIAL NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "SecondFossibSessionScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsightHuntingSubmissionScore" (
    "id" SERIAL NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "InsightHuntingSubmissionScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExplorerSubmissionScore" (
    "id" SERIAL NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "ExplorerSubmissionScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentoringReflectionScore" (
    "id" SERIAL NOT NULL,
    "reflection_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "MentoringReflectionScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentoringVlogSubmissionScore" (
    "id" SERIAL NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "MentoringVlogSubmissionScore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FirstFossibSessionScore" ADD CONSTRAINT "FirstFossibSessionScore_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "FirstFossibSessionSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecondFossibSessionScore" ADD CONSTRAINT "SecondFossibSessionScore_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "SecondFossibSessionSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightHuntingSubmissionScore" ADD CONSTRAINT "InsightHuntingSubmissionScore_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "InsightHuntingSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExplorerSubmissionScore" ADD CONSTRAINT "ExplorerSubmissionScore_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "ExplorerSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentoringReflectionScore" ADD CONSTRAINT "MentoringReflectionScore_reflection_id_fkey" FOREIGN KEY ("reflection_id") REFERENCES "MentoringReflection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentoringVlogSubmissionScore" ADD CONSTRAINT "MentoringVlogSubmissionScore_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "MentoringVlogSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
