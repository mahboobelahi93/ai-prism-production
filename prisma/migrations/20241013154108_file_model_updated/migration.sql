/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_tutorial_video_id_fkey";

-- DropForeignKey
ALTER TABLE "pilots" DROP CONSTRAINT "pilots_thumbnailFileId_fkey";

-- DropTable
DROP TABLE "File";

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "preview" TEXT,
    "key" TEXT NOT NULL,
    "file_class_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pilots" ADD CONSTRAINT "pilots_thumbnailFileId_fkey" FOREIGN KEY ("thumbnailFileId") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_tutorial_video_id_fkey" FOREIGN KEY ("tutorial_video_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
