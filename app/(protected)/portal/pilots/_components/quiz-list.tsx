"use client";

import { useState, useTransition } from "react";
import { addQuiz, deleteQuestion, deleteQuiz, updateQuiz } from "@/actions/quizzes";
import { Question, QuizSettings } from "@prisma/client";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";

import { TQuiz } from "@/types/quizz";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

import { QuizCreator } from "./add-quiz-form";
import { QuestionFormDialog } from "./question-form-dialog";

export function QuizList({
  quizzes,
  pilotId,
}: Readonly<{ quizzes: TQuiz[] | []; pilotId: string }>) {
  console.log("quizzes : ", quizzes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<TQuiz | null>(null);
  const [expanededQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [isPending, submitQuizInfo] = useTransition();
  const [isDeletingQuestion, setIsDeletingQuestion] = useState<number | null>(
    null,
  );
  const [isDeletingQuiz, setIsDeletingQuiz] = useState<number | null>(
    null,
  );
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const saveQuiz = () => {
    setIsModalOpen(false);
    setEditingQuiz(null);
  };

  const toggleExamStatus = async (quizId: string) => {
    const updatedQuizzes = quizzes.map((quiz) => {
      if (quiz.id === quizId) {
        return { ...quiz, setAsExam: !quiz.setAsExam };
      } else if (quiz.setAsExam) {
        return { ...quiz, setAsExam: false };
      }
      return quiz;
    });
    // setQuizzes(updatedQuizzes)
    const newExamQuiz = updatedQuizzes.find((q) => q.id === quizId);
    await updateQuiz(newExamQuiz.id, { setAsExam: newExamQuiz.setAsExam });
    if (newExamQuiz?.setAsExam) {
      toast({
        title: "Exam Status Updated",
        description: `"${newExamQuiz.title}" is now set as the exam.`,
      });
    }
  };

  const existingExamId = quizzes?.find((q) => q.setAsExam)?.id || null;

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedQuesIndex, setSelectedQuesIndex] = useState<string | null>(
    null,
  );
  const [isAddingQuestion, setIsAddingQuestion] = useState(null);

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
      const result = await deleteQuestion(selectedQuesIndex);
      console.log("result : ", result);
      // Update the local state to remove the deleted question
      // setQuestions((prevQuestions) =>
      //   prevQuestions.filter((_, i) => i !== selectedQuesIndex),
      // );

      if (result.success) {
        // Show success toast
        toast({
          title: "Success",
          description: "Question deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Failed to delete the question:", error);
      toast({
        title: "Error",
        description: "Failed to delete the question. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Close the confirmation dialog
      setConfirmationOpen(false);
    }
  }

  async function handleDeleteQuiz() {
    if (isDeletingQuiz === null || isDeletingQuiz === undefined) {
      toast({
        title: "Error",
        description: "No quiz selected for deletion.",
      });
      return;
    }

    try {
      // Attempt to delete the question
      const result = await deleteQuiz(isDeletingQuiz);
      if (result.success) {
        // Show success toast
        toast({
          title: "Success",
          description: "Quiz deleted successfully.",
        });
      }
      else {
        toast({
          title: "Error",
          variant: "destructive",
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Failed to delete the quiz:", error);
      toast({
        title: "Error",
        description: "Failed to delete the quiz. Please try again.",
      });
    } finally {
      // Close the confirmation dialog
      setConfirmationOpen(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quizzes</h1>
        {quizzes.length <= 0 && <Button onClick={() => setIsModalOpen(true)}>Add Quiz</Button>}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quiz Title</TableHead>
            <TableHead>Number of Questions</TableHead>
            <TableHead>Exam Duration</TableHead>
            <TableHead>Passing Grade</TableHead>
            <TableHead>Publish Exam</TableHead>
            <TableHead className="items-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizzes?.map((quiz) => (
            <>
              <TableRow key={quiz.id}>
                <TableCell>{quiz.title}</TableCell>
                <TableCell>{quiz.questions.length}</TableCell>
                <TableCell>{quiz.settings.timeLimit}</TableCell>
                <TableCell>{quiz.settings.passingGrade}%</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={quiz.setAsExam}
                      onCheckedChange={() => toggleExamStatus(quiz.id)}
                      aria-label={`Set ${quiz.title} as exam`}
                    />
                    <span>{quiz.setAsExam ? "Exam" : "Quiz"}</span>
                  </div>
                </TableCell>
                <TableCell className="flex items-center justify-end gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingQuiz(quiz);
                      setIsModalOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setIsDeletingQuiz(quiz.id);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsAddingQuestion(quiz.id)}
                  >
                    <Plus className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size={"sm"}
                    onClick={() =>
                      setExpandedQuiz(
                        quiz.id === expanededQuiz ? null : quiz.id,
                      )
                    }
                    className="flex items-center justify-end gap-2"
                  >
                    {/* <span>
                                            {expanededQuiz === quiz.id ? "Collapse" : "Expand"}
                                        </span> */}
                    {expanededQuiz === quiz.id ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </Button>
                </TableCell>
                {/* <TableCell className="text-right">
                                   
                                </TableCell> */}
              </TableRow>
              {expanededQuiz === quiz.id && (
                // <TableRow>
                //     <TableCell colSpan={5}>
                //         <Table>
                //             <TableBody>
                //                 {quiz.questions.map((question, index) => (
                //                     <TableRow key={question.id}>
                //                         <TableCell>{index + 1}</TableCell>
                //                         <TableCell>{question.question}</TableCell>
                //                         <TableCell className="text-right">
                //                             <Badge>{question.type}</Badge>
                //                         </TableCell>
                //                         <TableCell className="text-right">
                //                             <Button
                //                                 variant="outline"
                //                                 size="sm"
                //                                 onClick={() => {
                //                                     setEditingQuiz(quiz)
                //                                     setIsModalOpen(true)
                //                                 }}
                //                             >
                //                                 Edit
                //                             </Button>
                //                         </TableCell>
                //                     </TableRow>
                //                 ))}
                //             </TableBody>
                //         </Table>
                //     </TableCell>
                // </TableRow>

                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    {quiz.questions.map((question, index) => (
                      <Card key={question?.id ?? index} className="my-1">
                        <CardContent className="flex flex-col gap-4 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">
                                  Question {index + 1}
                                </h3>
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
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {question?.options.map((option, index) => (
                              <span
                                key={option?.id ?? index}
                                className={`rounded px-2 py-1 text-xs ${option.isCorrect
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
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
      {isModalOpen && (
        <QuizCreator
          onClose={() => {
            setIsModalOpen(false);
            setEditingQuiz(null);
          }}
          onSave={saveQuiz}
          editingQuiz={editingQuiz}
          existingExamId={existingExamId}
          pilotId={pilotId}
        />
      )}

      <QuestionFormDialog
        quizId={isAddingQuestion}
        open={!!isAddingQuestion}
        onClose={() => setIsAddingQuestion(null)}
      />
      <QuestionFormDialog
        quizId={expanededQuiz}
        open={!!editingQuestion}
        onClose={() => setEditingQuestion(null)}
        onSave={() => { }}
        initialQuestion={editingQuestion || undefined}
      />
      <ConfirmDialog
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        title="Confirm Action"
        description="Are you sure you want to delete this question?"
        confirmAction={handleDeleteQuestion}
        cancelAction={() => setConfirmationOpen(false)}
        confirmText="Confirm"
        cancelText="Cancel"
      />

      <ConfirmDialog
        open={isDeletingQuiz !== null}
        onOpenChange={() => setIsDeletingQuiz(null)}
        title="Confirm Action"
        description="Are you sure you want to delete this quiz?"
        confirmAction={handleDeleteQuiz}
        cancelAction={() => setIsDeletingQuiz(null)}
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </div>
  );
}
