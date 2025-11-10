"use client";

import { useEffect, useState } from "react";
import { getUserLessonProgress } from "@/actions/get-user-lesson-progress";
import { getUserQuizData } from "@/actions/get-user-quiz-data";
import { Book, CheckCircle2, Mail, User, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UserData {
  id: string;
  email: string;
  pilot: {
    id: string;
    title: string;
  };
  status: string;
  progress: number;
}

interface PilotUserProfileProps {
  userData: UserData;
}

interface QuizData {
  hasPassed: boolean;
  score: number | null;
}

interface ProgressData {
  totalLessons: number;
  completedLessons: number;
  progress: number;
}

export default function PilotUserProfile({ userData }: PilotUserProfileProps) {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [quiz, progress] = await Promise.all([
          getUserQuizData(userData.id),
          getUserLessonProgress(userData.id, userData.pilot.id),
        ]);
        setQuizData(quiz);
        setProgressData(progress);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [userData.id, userData.pilot.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Pilot User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-8 md:flex-row">
          <div className="flex-grow">
            <h2 className="mb-2 text-xl font-semibold">
              {userData.email.split("@")[0]}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                className="flex cursor-pointer items-center"
                onClick={() => navigator.clipboard.writeText(userData.email)}
                title="Click to copy"
              >
                <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center">
                <Book className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>{userData.pilot.title}</span>
              </div>
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5 text-muted-foreground" />
                <Badge variant="default">{userData.status}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Quiz Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quizData?.hasPassed ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium">Passed</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  No quiz passed yet
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Certification
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quizData?.hasPassed ? (
              <Badge variant="default" className="text-sm">
                Certified
              </Badge>
            ) : (
              <span className="text-muted-foreground">
                No certification yet, attempt and pass the quiz to get
                certified.
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Pilot Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={progressData?.progress || 0} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {progressData?.completedLessons || 0} of{" "}
                {progressData?.totalLessons || 0} lessons completed
              </span>
              <span>{progressData?.progress || 0}% completed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
