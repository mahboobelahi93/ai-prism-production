"use client";

import { useEffect, useState } from "react";
import { checkQuizAttempt, createQuizAttempt } from "@/actions/quizz-attempts";
import { useUser } from "@clerk/nextjs";
import { UserAnswer } from "@prisma/client";
import { CheckCircle2, XCircle } from "lucide-react";

import { QuizState, TQuiz } from "@/types/quizz";
import { showErrorToast } from "@/lib/handle-error";
import { formatTime } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import QuizResult from "./quiz-result";
import QuizStart from "./quiz-start";
import { Timer } from "./timer";

export default function AttemptQuiz({
  quizDetails,
  quizAttempt,
}: {
  quizDetails: TQuiz;
  quizAttempt: any;
}) {
  const { isLoaded, isSignedIn, user } = useUser();

  const [quizState, setQuizState] = useState({
    currentQuestionIndex: 0,
    isComplete: false,
    timeRemaining: (quizDetails?.settings?.timeLimit ?? 0) * 60,
  });
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    passed: boolean;
    feedback: string;
  } | null>(null);
  console.log("quizDetails : ", quizDetails);
  const quizQuestions = quizDetails?.questions;
  const currentQuestion = quizQuestions[quizState.currentQuestionIndex];

  if (!isLoaded) {
    return <div className="flex justify-center p-8">Loading quiz...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex justify-center p-8">
        <Card>
          <CardContent className="p-6">
            Please sign in to take the quiz.
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    if (quizAttempt.passed) {
      setQuizResult(quizAttempt);
      setQuizState((prevState) => ({
        ...prevState,
        isComplete: quizAttempt.attempted,
      }));
      setHasStarted(true);
    }
  }, [quizAttempt]);

  // useEffect(() => {
  //   const fetchQuizStatus = async () => {
  //     try {
  //       const status = await checkQuizAttempt({ userId, quizInfoId: quizDetails.id });
  //       if (status.passed) {
  //         setQuizResult(status);
  //         setQuizState((prevState) => ({ ...prevState, isComplete: status.attempted }));
  //         setHasStarted(true);
  //       }

  //     } catch (err) {
  //       console.error("Error fetching quiz status:", err);
  //       showErrorToast("Failed to load quiz status. Please try again.");
  //     } finally {
  //       // setLoading(false);
  //     }
  //   };

  //   fetchQuizStatus();
  // }, [user?.id, quizDetails.id]); // Dependencies ensure it runs when userId or quizInfoId changes

  console.log("selectedAnswers : ", selectedAnswers);
  const handleSubmit = async () => {
    if (!selectedAnswers.length) return;

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIds: selectedAnswers,
    };

    setUserAnswers((prev) => [...prev, newAnswer]);

    if (quizState.currentQuestionIndex + 1 >= quizQuestions.length) {
      try {
        const result = await createQuizAttempt({
          quizInfoId: quizDetails.id,
          userId: user?.id,
          answers: [...userAnswers, newAnswer],
        });

        setQuizResult({
          score: result.result.score,
          passed: result.result.passed,
          feedback: result.result.feedback,
        });

        setQuizState((prevState) => ({ ...prevState, isComplete: true }));
      } catch (error) {
        console.error("Failed to create quiz attempt:", error);
      }
    } else {
      setQuizState((prevState) => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
      }));
      setSelectedAnswers([]);
    }
  };

  if (!hasStarted) {
    return (
      <QuizStart
        onStart={() => {
          setHasStarted(true);
          setQuizState((prevState) => ({
            ...prevState,
            startTime: new Date(),
          }));
        }}
        quizDetails={quizDetails}
      />
    );
  }

  // if (quizState.isComplete) {
  //   const totalQuestions = quizQuestions.length;
  //   const timeTaken = quizDetails.settings?.timeLimit - quizState.timeRemaining; // 600 seconds = 10 minutes
  //   const formattedTimeTaken = formatTime(timeTaken);

  //   return (
  //     <Card className="mx-auto mt-8 w-full max-w-2xl">
  //       <CardHeader>
  //         <CardTitle>Quiz Completed</CardTitle>
  //       </CardHeader>
  //       <CardContent className="space-y-4">
  //         <div className="text-center text-2xl font-bold">
  //           Score: {((quizResult?.score ?? 0 / totalQuestions) * 100).toFixed(1)}%
  //         </div>
  //         <div className="text-center text-lg text-muted-foreground">
  //           Time Taken: {formattedTimeTaken}
  //         </div>
  //         <div className="space-y-4">
  //           {userAnswers.map((answer, index) => (
  //             <div key={answer.questionId} className="rounded-lg border p-4">
  //               <div className="flex items-start gap-2">
  //                 {Array.isArray(answer.correctAnswer) &&
  //                   JSON.stringify(answer.correctAnswer.sort()) ===
  //                   JSON.stringify(answer.selectedAnswers.sort()) ? (
  //                   <CheckCircle2 className="text-green-500" />
  //                 ) : (
  //                   <XCircle className="text-red-500" />
  //                 )}
  //                 <div className="w-full">
  //                   <p className="font-medium">
  //                     Question {index + 1}: {answer.question}
  //                   </p>
  //                   <p>
  //                     <span className="mt-1 text-sm text-muted-foreground">Your Answer:</span>{" "}
  //                     {Array.isArray(answer.selectedAnswers)
  //                       ? answer.selectedAnswers.join(", ")
  //                       : answer.selectedAnswers}
  //                   </p>
  //                   <p>
  //                     <span className="text-sm text-muted-foreground">Correct Answer:</span>{" "}
  //                     {Array.isArray(answer.correctAnswer)
  //                       ? answer.correctAnswer.join(", ")
  //                       : answer.correctAnswer}
  //                   </p>
  //                   <Alert>
  //                     <AlertTitle>Explanation</AlertTitle>
  //                     <AlertDescription className="mt-2 text-sm">{answer.explanation}</AlertDescription>
  //                   </Alert>
  //                 </div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  if (quizState.isComplete && quizResult) {
    return (
      <QuizResult
        quizResult={quizResult}
        tryAgain={() => {
          setHasStarted(true);
          setQuizState((prevState) => ({
            ...prevState,
            currentQuestionIndex: 0,
            isComplete: false,
            timeRemaining: (quizDetails?.settings?.timeLimit ?? 0) * 60,
          }));
          setSelectedAnswers([]);
          setUserAnswers([]);
          setQuizResult(null);
        }}
      />
    );
  }

  return (
    <Card className="mx-auto mt-8 w-full max-w-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            Question {quizState.currentQuestionIndex + 1} of{" "}
            {quizQuestions.length}
          </div>
        </div>
        <CardTitle>{currentQuestion.question}</CardTitle>
      </CardHeader>
      <div className="flex justify-end border-b p-4">
        <Timer
          timeRemaining={quizState.timeRemaining}
          onTimeEnd={() => setQuizState((s) => ({ ...s, isComplete: true }))}
          onTick={(newTime) =>
            setQuizState((s) => ({ ...s, timeRemaining: newTime }))
          }
        />
      </div>
      <CardContent className="pt-6">
        {currentQuestion.type === "single" && (
          <RadioGroup
            value={selectedAnswers[0]}
            onValueChange={(value) => setSelectedAnswers([value])}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent"
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="grow cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {currentQuestion.type === "multiple" && (
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent"
              >
                <input
                  type="checkbox"
                  id={option.id}
                  value={option.id}
                  checked={(selectedAnswers as string[]).includes(option.id)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedAnswers((prev) =>
                      e.target.checked
                        ? [...(prev as string[]), value]
                        : (prev as string[]).filter((id) => id !== value),
                    );
                  }}
                  className="cursor-pointer"
                />
                <Label htmlFor={option.id} className="grow cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        )}

        {currentQuestion.type === "true_false" && (
          <RadioGroup
            value={selectedAnswers[0]}
            onValueChange={(value) => setSelectedAnswers([value])}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="grow cursor-pointer">
                True
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="grow cursor-pointer">
                False
              </Label>
            </div>
          </RadioGroup>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() =>
            setQuizState((s) => ({
              ...s,
              currentQuestionIndex: Math.max(0, s.currentQuestionIndex - 1),
            }))
          }
          disabled={quizState.currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button onClick={handleSubmit} disabled={!selectedAnswers}>
          Submit Answer
        </Button>
      </CardFooter>
    </Card>
  );
}
