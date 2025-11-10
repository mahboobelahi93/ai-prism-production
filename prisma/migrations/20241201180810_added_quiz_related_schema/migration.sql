-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('single', 'multiple', 'true_false');

-- CreateEnum
CREATE TYPE "FeedbackMode" AS ENUM ('default', 'review', 'retry');

-- CreateEnum
CREATE TYPE "QuestionOrder" AS ENUM ('random', 'sequential');

-- CreateTable
CREATE TABLE "QuizInfo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "pilotId" TEXT NOT NULL,

    CONSTRAINT "QuizInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 10,
    "description" TEXT,
    "answerRequired" BOOLEAN NOT NULL DEFAULT true,
    "randomize" BOOLEAN NOT NULL DEFAULT false,
    "explanation" TEXT,
    "quizInfoId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizSettings" (
    "id" TEXT NOT NULL,
    "timeLimit" INTEGER,
    "hideQuizTime" BOOLEAN NOT NULL DEFAULT false,
    "feedbackMode" "FeedbackMode" NOT NULL,
    "passingGrade" DOUBLE PRECISION,
    "attemptsAllowed" INTEGER,
    "autoStart" BOOLEAN NOT NULL DEFAULT false,
    "questionOrder" "QuestionOrder" NOT NULL DEFAULT 'sequential',
    "hideQuestionNumber" BOOLEAN NOT NULL DEFAULT false,
    "quizInfoId" TEXT NOT NULL,

    CONSTRAINT "QuizSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "quizInfoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "selectedOptionIds" TEXT[],

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizResult" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "passed" BOOLEAN NOT NULL,
    "feedback" TEXT,

    CONSTRAINT "QuizResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizSettings_quizInfoId_key" ON "QuizSettings"("quizInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizResult_attemptId_key" ON "QuizResult"("attemptId");

-- AddForeignKey
ALTER TABLE "QuizInfo" ADD CONSTRAINT "QuizInfo_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "pilots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizInfoId_fkey" FOREIGN KEY ("quizInfoId") REFERENCES "QuizInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizSettings" ADD CONSTRAINT "QuizSettings_quizInfoId_fkey" FOREIGN KEY ("quizInfoId") REFERENCES "QuizInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizInfoId_fkey" FOREIGN KEY ("quizInfoId") REFERENCES "QuizInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswer" ADD CONSTRAINT "UserAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
