-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quizInfoId_fkey";

-- DropForeignKey
ALTER TABLE "QuizSettings" DROP CONSTRAINT "QuizSettings_quizInfoId_fkey";

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizInfoId_fkey" FOREIGN KEY ("quizInfoId") REFERENCES "QuizInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizSettings" ADD CONSTRAINT "QuizSettings_quizInfoId_fkey" FOREIGN KEY ("quizInfoId") REFERENCES "QuizInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
