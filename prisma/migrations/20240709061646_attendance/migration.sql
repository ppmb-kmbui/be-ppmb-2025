-- CreateTable
CREATE TABLE "attendances" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "user_id" INTEGER NOT NULL,
    "attendance_id" INTEGER NOT NULL,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("user_id","attendance_id")
);

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "attendances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
