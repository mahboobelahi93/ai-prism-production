-- CreateEnum
CREATE TYPE "PilotOwnerRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "pilot_owner_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organization" TEXT,
    "contactNumber" TEXT,
    "purpose" TEXT,
    "status" "PilotOwnerRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "processedBy" TEXT,

    CONSTRAINT "pilot_owner_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pilot_owner_requests" ADD CONSTRAINT "pilot_owner_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
