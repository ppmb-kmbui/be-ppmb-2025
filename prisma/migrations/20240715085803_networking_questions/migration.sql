-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_mandatory" BOOLEAN NOT NULL DEFAULT false,
    "networkingQuestionSetId" INTEGER,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "networking_question_sets" (
    "id" SERIAL NOT NULL,
    "from" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,

    CONSTRAINT "networking_question_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "networking_question_submissions" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "networking_question_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "networking_question_set_submissions" (
    "id" SERIAL NOT NULL,
    "networkingQuestionSetId" INTEGER NOT NULL,
    "from" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,

    CONSTRAINT "networking_question_set_submissions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_networkingQuestionSetId_fkey" FOREIGN KEY ("networkingQuestionSetId") REFERENCES "networking_question_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "networking_question_submissions" ADD CONSTRAINT "networking_question_submissions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "networking_question_set_submissions" ADD CONSTRAINT "networking_question_set_submissions_networkingQuestionSetI_fkey" FOREIGN KEY ("networkingQuestionSetId") REFERENCES "networking_question_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
