import * as z from "zod";

export const pilotFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  thumbnail: z
    .any()
    .refine(
      (value) =>
        (Array.isArray(value) && value.length > 0) ||
        (value !== undefined && value !== null && value !== ""),
      {
        message: "Thumbnail is required",
      },
    )
    .refine(
      (value) => {
        if (Array.isArray(value) && value[0] instanceof File) {
          return value[0].size <= 1.9 * 1024 * 1024;
        }
        return true;
      },
      { message: "Thumbnail size should be less than 2MB" },
    ),
  isPublished: z.boolean().optional().default(false),
});

export const lessonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),

  tutorialVideo: z.any().optional(),
  description: z.string().optional(),
  isPublished: z.boolean(),
  duration: z.number().optional(),
  notes: z.array(z.any()).optional(),
});

export const quizInfoSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
  summary: z.string().optional(),
  setAsExam: z.boolean().optional().default(false),
});

export const questionSchema = z.object({
  question: z.string().min(1, "Question text is required"),
  type: z.enum(["single", "multiple", "true_false"], {
    required_error: "Please select a question type",
  }),
  points: z.number().min(0).default(10),
  description: z.string().optional(),
  answerRequired: z.boolean().default(true),
  randomize: z.boolean().default(false),
  options: z
    .array(
      z.object({
        text: z.string(),
        isCorrect: z.boolean(),
      }),
    )
    .optional(),
  explanation: z.string().optional(),
});

export const quizSettingsSchema = z.object({
  timeLimit: z.number().min(0).default(60),
  hideQuizTime: z.boolean().default(false),
  feedbackMode: z.enum(["default", "review", "retry"]),
  passingGrade: z.number().min(0).max(100).optional(),
  attemptsAllowed: z.number().min(1).optional(),
  autoStart: z.boolean().default(false),
  questionOrder: z.enum(["random", "sequential"]).default("sequential"),
  hideQuestionNumber: z.boolean().default(false),
});

export type QuizInfo = z.infer<typeof quizInfoSchema>;
export type Question = z.infer<typeof questionSchema>;
export type QuizSettings = z.infer<typeof quizSettingsSchema>;
