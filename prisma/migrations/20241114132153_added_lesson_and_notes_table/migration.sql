-- CreateTable
CREATE TABLE "notes" (
    "id" SERIAL NOT NULL,
    "lessonId" TEXT NOT NULL,
    "name" TEXT,
    "notePath" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "noteSignature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
