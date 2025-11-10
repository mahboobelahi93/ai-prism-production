"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import {
  addQuiz,
  createQuizInfo,
  deleteQuestion,
  updateQuiz,
} from "@/actions/quizzes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Question,
  questionSchema,
  quizInfoSchema,
  QuizSettings,
  quizSettingsSchema,
} from "@/lib/validations/pilots";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

import { QuestionFormDialog } from "./question-form-dialog";

type Step = "info" | "questions" | "settings";

interface QuizCreatorProps {
  onClose: () => void;
  onSave: () => void;
  editingQuiz?: {
    id: string;
    title: string;
    summary: string;
    setAsExam: boolean;
    questions: Question[];
    settings: QuizSettings;
  } | null;
  existingExamId: string | null;
  pilotId: string;
}

export function QuizCreator({
  onClose,
  onSave,
  editingQuiz,
  existingExamId,
  pilotId,
}: QuizCreatorProps) {
  const [step, setStep] = useState<Step>("info");
  const [questions, setQuestions] = useState<Question[]>(
    editingQuiz?.questions || [],
  );
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<
    number | null
  >(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState<
    number | null | undefined
  >(null);
  const [isPending, submitQuizInfo] = useTransition();
  const [quizId, setQuizId] = useState<null | string>(editingQuiz?.id ?? null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedQuesIndex, setSelectedQuesIndex] = useState(null);

  const handleEditQuestion = (questionData: Omit<Question, "id">) => {
    if (!editingQuestion) return;
    setQuestions(
      questions.map((q) =>
        q.id === editingQuestion.id ? { ...questionData, id: q.id } : q,
      ),
    );
  };

  const infoForm = useForm({
    resolver: zodResolver(quizInfoSchema),
    defaultValues: {
      title: editingQuiz?.title || "",
      summary: editingQuiz?.summary || "",
      setAsExam: editingQuiz?.setAsExam || false,
    },
  });

  const questionForm = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: "",
      type: "single",
      points: 10,
      description: "",
      answerRequired: true,
      randomize: false,
      explanation: "",
      options: [],
    },
  });

  const settingsForm = useForm({
    resolver: zodResolver(quizSettingsSchema),
    defaultValues: editingQuiz?.settings || {
      timeLimit: undefined,
      hideQuizTime: false,
      feedbackMode: "default",
      passingGrade: undefined,
      attemptsAllowed: 1,
      autoStart: false,
      questionOrder: "sequential",
      hideQuestionNumber: false,
    },
  });

  useEffect(() => {
    if (editingQuiz) {
      infoForm.reset({
        title: editingQuiz.title,
        summary: editingQuiz.summary,
        setAsExam: editingQuiz.setAsExam,
      });
      setQuestions(editingQuiz.questions);
      settingsForm.reset(editingQuiz.settings);
    }
  }, [editingQuiz]);

  function onInfoSubmit(data: any) {
    console.log(
      "onInfoSubmit",
      data,
      infoForm.formState.dirtyFields,
      "||",
      settingsForm.formState.dirtyFields,
    );
    // submitQuizInfo(async () => {
    //     await createQuizInfo({
    //         id: editingQuiz?.id,
    //         ...data,
    //         pilotId: "123",
    //     })
    // })
    setStep("settings");
  }

  function onQuestionSubmit(data: Question) {
    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = data;
      setQuestions(updatedQuestions);
      setEditingQuestionIndex(null);
    } else {
      setQuestions([...questions, data]);
    }
    questionForm.reset();
  }

  function onSettingsSubmit(data: QuizSettings) {
    const newQuizData = {
      id: editingQuiz?.id,
      ...infoForm.getValues(),
      questions,
      settings: data,
    };
    console.log("newQuizData : ", newQuizData);
    const hasDirtyFields =
      Object.keys(infoForm.formState.dirtyFields).length > 0 ||
      Object.keys(settingsForm.formState.dirtyFields).length > 0;

    if (quizId) {
      if (hasDirtyFields) {
        // Update existing quiz
        submitQuizInfo(async () => {
          try {
            const result = await updateQuiz(quizId, {
              ...newQuizData,
              pilotId,
            });
            if (result.success) {
              toast({ title: result.message });
              setStep("questions");
              setQuizId(result?.data?.id ?? null);
              onSave();
            } else {
              toast({
                title: "Failed to update quiz",
                description: result.message,
              });
            }
          } catch (error) {
            console.error("Error updating quiz:", error);
            toast({
              title: "Error",
              description:
                "An unexpected error occurred while updating the quiz.",
            });
          }
        });
      } else {
        // No changes, move to questions
        setStep("questions");
      }
    } else {
      // Add new quiz
      submitQuizInfo(async () => {
        try {
          const result = await addQuiz({ ...newQuizData, pilotId });
          if (result.success) {
            toast({ title: result.message });
            setStep("questions");
            setQuizId(result?.data?.id ?? null);
            onSave();
          } else {
            toast({
              title: "Failed to save quiz",
              description: result.message,
            });
          }
        } catch (error) {
          console.error("Error saving quiz:", error);
          toast({
            title: "Error",
            description: "An unexpected error occurred while saving the quiz.",
          });
        }
      });
    }
  }

  function editQuestion(index: number) {
    const questionToEdit = questions[index];
    questionForm.reset(questionToEdit);
    setEditingQuestionIndex(index);
  }

  async function handleDeleteQuestion() {
    if (selectedQuesIndex === null || selectedQuesIndex === undefined) {
      toast({
        title: "Error",
        description: "No question selected for deletion.",
      });
      return;
    }

    try {
      // Attempt to delete the question
      await deleteQuestion(selectedQuesIndex);

      // Update the local state to remove the deleted question
      setQuestions((prevQuestions) =>
        prevQuestions.filter((_, i) => i !== selectedQuesIndex),
      );

      // Show success toast
      toast({
        title: "Success",
        description: "Question deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete the question:", error);
      toast({
        title: "Error",
        description: "Failed to delete the question. Please try again.",
      });
    } finally {
      // Close the confirmation dialog
      setConfirmationOpen(false);
    }
  }

  console.log(
    "errors : ",
    settingsForm.formState.errors,
    " info form: ",
    infoForm.formState.errors,
  );
  return (
    <Dialog open={true} onOpenChange={onClose} modal={true}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto lg:max-w-screen-lg">
        <DialogHeader>
          <DialogTitle>{editingQuiz ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
        </DialogHeader>
        <div className="relative mb-8">
          <div className="mb-2 flex justify-between">
            <span className={step === "info" ? "font-medium text-primary" : ""}>
              Quiz info
            </span>
            <span
              className={step === "settings" ? "font-medium text-primary" : ""}
            >
              {/* Settings */}
            </span>
            {/* <span className={step === "questions" ? "font-medium text-primary" : ""}>Question</span> */}
          </div>
          <div className="h-2 w-full rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width:
                  step === "info"
                    ? "50%"
                    : step === "settings"
                      ? "100%"
                      : "100%",
              }}
            />
          </div>
        </div>

        {step === "info" && (
          <Form {...infoForm}>
            <form
              onSubmit={infoForm.handleSubmit(onInfoSubmit)}
              className="space-y-6"
            >
              <FormField
                control={infoForm.control}
                name="title"
                render={({ field }) => {
                  const value = field.value || "";
                  return (
                    <FormItem>
                      <FormLabel>Quiz Title</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Type your quiz title here"
                            {...field}
                            maxLength={50}
                            className="w-full"
                          />
                        </div>
                      </FormControl>
                      <div className="mt-1 text-right text-xs text-muted-foreground">
                        {value.length} / 50
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={infoForm.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Summary</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a short summary to prepare students for the quiz"
                        {...field}
                        maxLength={200}
                      />
                    </FormControl>
                    {/* <FormDescription>
                      This text is shown on the course page beside the tooltip
                      beside the Quiz name.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={infoForm.control}
                name="setAsExam"
                render={({ field }) => (
                  <FormItem className="hidden flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          if (
                            checked &&
                            existingExamId &&
                            existingExamId !== editingQuiz?.id
                          ) {
                            if (
                              confirm(
                                "Another quiz is already set as an exam. Do you want to make this quiz the exam instead?",
                              )
                            ) {
                              field.onChange(checked);
                            }
                          } else {
                            field.onChange(checked);
                          }
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Set as Exam</FormLabel>
                      <FormDescription>
                        If checked, this quiz will be treated as an exam. Only
                        one quiz can be an exam at a time.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" type="button" disabled>
                    Back
                  </Button>
                  <Button type="submit">Next</Button>
                </div>
              </div>
            </form>
          </Form>
        )}

        {step === "settings" && (
          <Form {...settingsForm}>
            <form
              onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}
              className="space-y-6"
            >
              {/* Time Limit Field */}
              <FormField
                control={settingsForm.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        min={10}
                        max={1440}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Passing Grade Field */}
              <FormField
                control={settingsForm.control}
                name="passingGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passing Grade (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        {...field}
                        min={0}
                        max={100}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Attempts Allowed Field */}
              <FormField
                control={settingsForm.control}
                name="attemptsAllowed"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>Attempts Allowed</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Auto Start Field */}
              {/* <FormField
                                control={settingsForm.control}
                                name="autoStart"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Auto Start</FormLabel>
                                            <FormDescription>
                                                If checked, the quiz will start automatically when accessed.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            /> */}

              {/* Question Order Field */}
              {/* <FormField
                                control={settingsForm.control}
                                name="questionOrder"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Question Order</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="sequential" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Sequential</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="random" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Random</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

              {/* Hide Question Number Field */}
              {/* <FormField
                                control={settingsForm.control}
                                name="hideQuestionNumber"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Hide Question Number</FormLabel>
                                            <FormDescription>
                                                If checked, the question numbers will be hidden.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            /> */}

              {/* Feedback Mode Field */}
              {/* <FormField
                                control={settingsForm.control}
                                name="feedbackMode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quiz Feedback Mode</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="default" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Default</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="review" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Review Mode</FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="retry" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">Retry Mode</FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

              {/* Form Actions */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setStep("info")}
                >
                  Back
                </Button>
                {/* {isPending ? <ButtonLoading /> : <Button type="submit">Next</Button>} */}
                {isPending ? (
                  <ButtonLoading />
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </div>
            </form>
          </Form>
        )}

        {step === "questions" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setIsAddingQuestion(true)}>
                <Plus className="mr-2 size-4" />
                Add Question
              </Button>
            </div>
            <div className="space-y-4">
              {questions.map((question, index) => (
                // <Card key={i}>
                //     <CardContent className="flex items-center justify-between p-4">
                //         <div className="flex-1">
                //             <h3 className="font-medium">Question {i + 1}</h3>
                //             <p className="text-sm text-muted-foreground">{q.question}</p>
                //             <span className="mt-1 inline-block text-xs capitalize text-muted-foreground">
                //                 {q.type.replace('-', ' ')}
                //             </span>
                //         </div>
                //         <div className="flex gap-2">
                //             <Button variant="ghost" size="icon" onClick={() => editQuestion(i)}>
                //                 <Pencil className="size-4" />
                //             </Button>
                //             <Button variant="ghost" size="icon" onClick={() => deleteQuestion(i)}>
                //                 <Trash2 className="size-4" />
                //             </Button>
                //         </div>
                //     </CardContent>
                // </Card>
                <Card key={question?.id ?? index}>
                  <CardContent className="flex flex-col gap-4 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">Question {index + 1}</h3>
                          <span className="text-sm text-muted-foreground">
                            ({question.points}{" "}
                            {question.points === 1 ? "point" : "points"})
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {question.question}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingQuestion(question)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedQuesIndex(question.id);
                            setConfirmationOpen(true);
                          }}
                          disabled={isDeletingQuestion === question.id}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {question?.options.map((option, index) => (
                        <span
                          key={option?.id ?? index}
                          className={`rounded px-2 py-1 text-xs ${
                            option.isCorrect
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {option.text}
                        </span>
                      ))}
                    </div>
                    {question.explanation && (
                      <div className="rounded-md bg-muted/50 p-3 text-sm">
                        <strong className="mb-1 block text-xs uppercase tracking-wide">
                          Explanation
                        </strong>
                        {question.explanation}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Separator className="my-4" />
            <div>
              <div className="space-y-6 p-6">
                {/* <Form {...questionForm}>
                                    <form onSubmit={questionForm.handleSubmit(onQuestionSubmit)} className="space-y-6"> */}
                {/* <FormField
                                            control={questionForm.control}
                                            name="question"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Question</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Write your question here" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={questionForm.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Question Type</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={(value) => {
                                                                field.onChange(value)
                                                                questionForm.setValue("options", [])
                                                            }}
                                                            value={field.value}
                                                            className="flex flex-col space-y-1"
                                                        >
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="single" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">Single Choice</FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="multiple" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">Multiple Choice</FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="true_false" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">True/False</FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {(questionForm.watch("type") === "single" || questionForm.watch("type") === "multiple") && (
                                            <FormField
                                                control={questionForm.control}
                                                name="options"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>Options</FormLabel>
                                                        <FormControl>
                                                            <div className="space-y-2">
                                                                {questionForm.watch("options").map((option: any, index: number) => (
                                                                    <div key={index} className="flex items-center space-x-2">
                                                                        {questionForm.watch("type") === "single" ? (
                                                                            <RadioGroup>
                                                                                <RadioGroupItem
                                                                                    value={option.isCorrect}
                                                                                    onValueChange={(value) => {
                                                                                        const newOptions = [...questionForm.getValues("options")]
                                                                                        newOptions[index] = { ...newOptions[index], isCorrect: value }
                                                                                        questionForm.setValue("options", newOptions)
                                                                                    }}
                                                                                />
                                                                            </RadioGroup>
                                                                        ) : (
                                                                            <Checkbox
                                                                                checked={option.isCorrect}
                                                                                onCheckedChange={(checked) => {
                                                                                    const newOptions = [...questionForm.getValues("options")]
                                                                                    newOptions[index] = { ...newOptions[index], isCorrect: checked }
                                                                                    questionForm.setValue("options", newOptions)
                                                                                }}
                                                                            />
                                                                        )}
                                                                        <Input
                                                                            placeholder={`Option ${index + 1}`}
                                                                            value={option.text}
                                                                            onChange={(e) => {
                                                                                const newOptions = [...questionForm.getValues("options")]
                                                                                newOptions[index] = { ...newOptions[index], text: e.target.value }
                                                                                questionForm.setValue("options", newOptions)
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </FormControl>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full"
                                                            onClick={() => {
                                                                const currentOptions = questionForm.getValues("options")
                                                                questionForm.setValue("options", [...currentOptions, { text: "", isCorrect: false }])
                                                            }}
                                                        >
                                                            <Plus className="mr-2 size-4" />
                                                            Add Option
                                                        </Button>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                        {questionForm.watch("type") === "true_false" && (
                                            <FormField
                                                control={questionForm.control}
                                                name="options"
                                                render={() => (
                                                    <FormItem>
                                                        <FormLabel>Correct Answer</FormLabel>
                                                        <FormControl>
                                                            <RadioGroup
                                                                onValueChange={(value) => {
                                                                    questionForm.setValue("options", [
                                                                        { text: "True", isCorrect: value === "true" },
                                                                        { text: "False", isCorrect: value === "false" },
                                                                    ])
                                                                }}
                                                                className="flex flex-col space-y-1"
                                                            >
                                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                                    <FormControl>
                                                                        <RadioGroupItem value="true" />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">True</FormLabel>
                                                                </FormItem>
                                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                                    <FormControl>
                                                                        <RadioGroupItem value="false" />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">False</FormLabel>
                                                                </FormItem>
                                                            </RadioGroup>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )} */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setStep("settings")}
                  >
                    Back
                  </Button>
                  <div className="space-x-2">
                    {/* <Button type="submit">{editingQuestionIndex !== null ? 'Update' : 'Add'} Question</Button> */}
                    <Button type="button" onClick={() => onSave()}>
                      Finish
                    </Button>
                  </div>
                </div>
                {/* </form>
                                </Form> */}
              </div>
            </div>
          </div>
        )}

        <QuestionFormDialog
          quizId={quizId}
          open={isAddingQuestion}
          onClose={() => setIsAddingQuestion(false)}
        />

        <QuestionFormDialog
          quizId={quizId}
          open={!!editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSave={handleEditQuestion}
          initialQuestion={editingQuestion || undefined}
        />
        <ConfirmDialog
          open={confirmationOpen}
          onOpenChange={setConfirmationOpen}
          title="Confirm Action"
          description="Are you sure you want to delete this lesson?"
          confirmAction={handleDeleteQuestion}
          cancelAction={() => setConfirmationOpen(false)}
          confirmText="Confirm"
          cancelText="Cancel"
        />
      </DialogContent>
    </Dialog>
  );
}
