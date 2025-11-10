/*
  Warnings:

  - You are about to drop the column `requestedAt` on the `pilot_owner_requests` table. All the data in the column will be lost.
  - The `status` column on the `pilot_owner_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId]` on the table `pilot_owner_requests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `pilot_owner_requests` table without a default value. This is not possible if the table is not empty.
  - Made the column `organization` on table `pilot_owner_requests` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactNumber` on table `pilot_owner_requests` required. This step will fail if there are existing NULL values in that column.
  - Made the column `purpose` on table `pilot_owner_requests` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "pilot_owner_requests" DROP CONSTRAINT "pilot_owner_requests_userId_fkey";

-- AlterTable
ALTER TABLE "pilot_owner_requests" DROP COLUMN "requestedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "organization" SET NOT NULL,
ALTER COLUMN "contactNumber" SET NOT NULL,
ALTER COLUMN "purpose" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "clerkId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pilot_owner_requests_userId_key" ON "pilot_owner_requests"("userId");

-- AddForeignKey
ALTER TABLE "pilot_owner_requests" ADD CONSTRAINT "pilot_owner_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
