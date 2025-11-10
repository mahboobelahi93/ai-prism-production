/*
  Warnings:

  - You are about to drop the column `noteId` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `notePath` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `noteSignature` on the `notes` table. All the data in the column will be lost.
  - Added the required column `key` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "noteId",
DROP COLUMN "notePath",
DROP COLUMN "noteSignature",
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "preview" TEXT,
ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
