-- CreateTable
CREATE TABLE "networking_scores" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "networking_scores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "networking_scores" ADD CONSTRAINT "networking_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
