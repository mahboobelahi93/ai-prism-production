import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { XCircle, RotateCcw, CheckCircle2 } from "lucide-react"

export default function QuizResult({ quizResult, tryAgain }: Readonly<{
    quizResult: {
        score: number;
        passed: boolean;
        feedback: string;
    },
    tryAgain: () => void
}>) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardContent className="space-y-4 pt-6 text-center">
                    <h1 className="mb-6 text-2xl font-bold text-primary">Quiz Complete!</h1>

                    <div className="flex flex-col items-center justify-center space-y-2">
                        {quizResult.passed ? (
                            <>
                                <CheckCircle2 className="mb-2 size-12 text-green-500" />
                                <p className="text-xl">
                                    Your Score: <span className="font-bold">{quizResult.score}</span>
                                </p>
                                <p className="text-lg font-semibold text-green-500">Status: Passed</p>
                            </>
                        ) : (
                            <>
                                <XCircle className="mb-2 size-12 text-red-500" />
                                <p className="text-xl">
                                    Your Score: <span className="font-bold">{quizResult.score}</span>
                                </p>
                                <p className="text-lg font-semibold text-red-500">Status: Failed</p>
                            </>
                        )}
                    </div>
                    {!quizResult.passed ?
                        <p className="text-lg text-muted-foreground">Keep trying, you&apos;ll get it next time!</p>
                        :
                        <p className="text-lg text-muted-foreground">Congratulations! You&apos;ve successfully completed the quiz!</p>
                    }
                </CardContent>

                {!quizResult.passed &&
                    <CardFooter className="flex justify-center pb-6">
                        <Button className="w-full max-w-[200px]" onClick={tryAgain}>
                            <RotateCcw className="mr-2 size-4" />
                            Try Again
                        </Button>
                    </CardFooter>
                }
            </Card>
        </div>
    )
}

