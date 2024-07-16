-- AlterTable
ALTER TABLE "NetworkingTask" ADD COLUMN     "is_done" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "QuestionTask" (
    "question_id" INTEGER NOT NULL,
    "from_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,
    "answer" TEXT,

    CONSTRAINT "QuestionTask_pkey" PRIMARY KEY ("question_id","from_id","to_id")
);

-- AddForeignKey
ALTER TABLE "QuestionTask" ADD CONSTRAINT "QuestionTask_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionTask" ADD CONSTRAINT "QuestionTask_from_id_to_id_fkey" FOREIGN KEY ("from_id", "to_id") REFERENCES "NetworkingTask"("from_id", "to_id") ON DELETE RESTRICT ON UPDATE CASCADE;
