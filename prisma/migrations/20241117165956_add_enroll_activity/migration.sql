-- CreateEnum
CREATE TYPE "EnrollStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "enrollActivities" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "pilot_id" TEXT NOT NULL,
    "enroll_status" "EnrollStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "approved_at" TIMESTAMP(3),

    CONSTRAINT "enrollActivities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "enrollActivities" ADD CONSTRAINT "enrollActivities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollActivities" ADD CONSTRAINT "enrollActivities_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollActivities" ADD CONSTRAINT "enrollActivities_pilot_id_fkey" FOREIGN KEY ("pilot_id") REFERENCES "pilots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
