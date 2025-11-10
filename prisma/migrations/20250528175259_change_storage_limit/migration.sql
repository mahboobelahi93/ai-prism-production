-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('PENDING', 'ACCEPTED', 'FINALIZEDVIAEMAIL');

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "storageLimit" SET DEFAULT 1073741824;

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL,
    "pilotId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "scheduledDateTime" TIMESTAMP(3) NOT NULL,
    "message" TEXT,
    "finalMessage" TEXT,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "schedules_userId_idx" ON "schedules"("userId");

-- CreateIndex
CREATE INDEX "schedules_ownerId_idx" ON "schedules"("ownerId");

-- CreateIndex
CREATE INDEX "schedules_pilotId_idx" ON "schedules"("pilotId");

-- CreateIndex
CREATE INDEX "schedules_status_idx" ON "schedules"("status");

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "pilots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
