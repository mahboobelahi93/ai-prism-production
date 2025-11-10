-- CreateTable
CREATE TABLE "pilots" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnailFileId" TEXT,
    "category" TEXT NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "pilots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "order_number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tutorial_video_id" TEXT,
    "is  _published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "pilot_id" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pilots_thumbnailFileId_key" ON "pilots"("thumbnailFileId");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_tutorial_video_id_key" ON "lessons"("tutorial_video_id");

-- AddForeignKey
ALTER TABLE "pilots" ADD CONSTRAINT "pilots_thumbnailFileId_fkey" FOREIGN KEY ("thumbnailFileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_pilot_id_fkey" FOREIGN KEY ("pilot_id") REFERENCES "pilots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_tutorial_video_id_fkey" FOREIGN KEY ("tutorial_video_id") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
