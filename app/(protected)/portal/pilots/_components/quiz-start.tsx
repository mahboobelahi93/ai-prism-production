import { TQuiz } from "@/types/quizz";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface QuizStartProps {
  onStart: () => void;
  quizDetails: TQuiz;
}

export default function QuizStart({ onStart, quizDetails }: QuizStartProps) {
  return (
    <Card className="mx-auto mt-8 w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Welcome to the Quiz Challenge!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Quiz Types Available:</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>Single Choice</li>
            <li>Multiple Choice</li>
            <li>True/False</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Quiz Information: '{quizDetails.title}'
          </h3>
          {quizDetails.description && (
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                {quizDetails.description}
              </p>
            </div>
          )}
          <p>
            <strong>Time Limit:</strong> {quizDetails.settings?.timeLimit}{" "}
            Minutes
          </p>
          <p>
            <strong>Total Questions:</strong> {quizDetails.questions.length}
          </p>
          <p>
            <strong>Passing Grade:</strong>{" "}
            {quizDetails?.settings?.passingGrade}%
          </p>
          {/* <p><strong>Attempts per Question:</strong> 2</p> */}
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">Instructions:</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>Read each question carefully before answering.</li>
            <li>
              You can navigate between questions using the Previous and Next
              buttons.
            </li>
            <li>The timer will start as soon as you begin the quiz.</li>
            <li>Your progress is saved automatically for each question.</li>
          </ul>
        </div>

        <div className="rounded-md bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Contact our support center or let us know if
            you face any issue.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        {quizDetails ? (
          <Button
            onClick={onStart}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            Start Quiz →
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
