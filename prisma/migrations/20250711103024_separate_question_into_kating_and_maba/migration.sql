-- CreateTable
CREATE TABLE "questions_kating" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_mandatory" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "questions_kating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionKatingTask" (
    "question_id" INTEGER NOT NULL,
    "from_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,
    "answer" TEXT,

    CONSTRAINT "QuestionKatingTask_pkey" PRIMARY KEY ("question_id","from_id","to_id")
);

-- CreateTable
CREATE TABLE "NetworkingKatingTask" (
    "from_id" INTEGER NOT NULL,
    "to_id" INTEGER NOT NULL,
    "img_url" TEXT,
    "is_done" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "NetworkingKatingTask_pkey" PRIMARY KEY ("from_id","to_id")
);

-- AddForeignKey
ALTER TABLE "QuestionKatingTask" ADD CONSTRAINT "QuestionKatingTask_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions_kating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionKatingTask" ADD CONSTRAINT "QuestionKatingTask_from_id_to_id_fkey" FOREIGN KEY ("from_id", "to_id") REFERENCES "NetworkingKatingTask"("from_id", "to_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkingKatingTask" ADD CONSTRAINT "NetworkingKatingTask_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkingKatingTask" ADD CONSTRAINT "NetworkingKatingTask_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
