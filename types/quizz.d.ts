import { QuizSettings } from "@prisma/client";

export type QuestionOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  question: string;
  type: "single" | "multiple" | "true_false";
  options: QuestionOption[];
  explanation: string;
  points: number;
};

export type QuestionFormData = Omit<Question, "id">;

export interface QuizState {
  currentQuestionIndex: number;
  isComplete: boolean;
  startTime?: Date;
  endTime?: Date;
  timeRemaining: number;
}

export type TQuiz = {
  id: string;
  title: string;
  summary: string;
  setAsExam: boolean;
  pilotId: string;
  questions: Question[];
  settings: QuizSettings | null;
};
