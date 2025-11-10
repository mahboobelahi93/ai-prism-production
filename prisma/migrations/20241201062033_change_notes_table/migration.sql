/*
  Warnings:

  - Added the required column `file_class_type` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "file_class_type" TEXT NOT NULL;
