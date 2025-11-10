-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'SUPERADMIN';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "suspendedAt" TIMESTAMP(3),
ADD COLUMN     "suspendedById" TEXT,
ADD COLUMN     "suspensionReason" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_suspendedById_fkey" FOREIGN KEY ("suspendedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
