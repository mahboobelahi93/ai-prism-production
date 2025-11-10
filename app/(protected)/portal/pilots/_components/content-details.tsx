"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  getLessonCompletionStatus,
  getUserProgressForPilot,
  markLessonAsComplete,
} from "@/actions/lessonprogress";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Check,
  Clock,
  Download,
  FileText,
  Loader,
  Pause,
  Play,
  ShieldCheck,
  Star,
} from "lucide-react";

import type { TQuiz } from "@/types/quizz";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AttemptQuiz from "./attempt-quiz";
import Certificate from "./certificate";

export default function ContentDetails({
  courseContent,
  quizzes,
  quizAttempt,
}: {
  courseContent: any;
  quizzes: TQuiz;
  quizAttempt: any;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isShowCertificate, setIsShowCertificate] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(() => {
    const firstLesson = courseContent.data.lessons[0];
    const firstVideo = firstLesson?.tutorialVideo?.[0];
    return firstVideo
      ? {
          title: firstLesson.title,
          src: firstVideo.preview,
          lessonId: firstLesson.id,
          description: firstLesson.description,
          notes: firstLesson.notes,
          duration: firstLesson.duration,
        }
      : {
          title: "No Video Available",
          src: "",
          lessonId: "",
          description: "",
          notes: [],
          duration: "",
        };
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const [completedLessons, setCompletedLessons] = useState(new Set<string>());
  const [progress, setProgress] = useState(0);
  const [isQuiz, setIsQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("certificate.pdf");
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [completionStatus, pilotProgress] = await Promise.all([
          Promise.all(
            courseContent.data.lessons.map(async (lesson) => {
              const isCompleted = await getLessonCompletionStatus(lesson.id);
              return { lessonId: lesson.id, isCompleted };
            }),
          ),

          getUserProgressForPilot(courseContent?.data?.id),
        ]);

        const completedLessonIds = new Set<string>();
        completionStatus.forEach(({ lessonId, isCompleted }) => {
          if (isCompleted) {
            completedLessonIds.add(lessonId);
          }
        });

        // Update states
        setCompletedLessons(completedLessonIds);
        setProgress(pilotProgress.progress);
        console.log("progress", pilotProgress.progress);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [courseContent.data.lessons, courseContent.data.id]);

  const markAsComplete = useCallback(async () => {
    if (currentVideo.lessonId && !completedLessons.has(currentVideo.lessonId)) {
      try {
        await markLessonAsComplete(currentVideo.lessonId);
        setCompletedLessons((prev) => new Set(prev).add(currentVideo.lessonId));

        // Update progress
        const updatedProgress = await getUserProgressForPilot(
          courseContent.data.id,
        );
        setProgress(updatedProgress.progress);
      } catch (error) {
        console.error("Failed to mark lesson as complete:", error);
      }
    }
  }, [currentVideo.lessonId, completedLessons, courseContent.data.id]);

  const handleLessonChange = useCallback((lesson: any) => {
    // Check if lesson exists
    if (!lesson) {
      console.error("No lesson data provided");
      return;
    }

    // Reset video state regardless of video availability
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }

    // Update current video state even if video is not available
    setCurrentVideo({
      lessonId: lesson.id,
      title: lesson.title,
      src: lesson.tutorialVideo?.[0]?.preview || "",
      description: lesson.description || "",
      notes: lesson.notes || [],
      duration: lesson.duration || "",
    });
  }, []);

  const handleNextLesson = useCallback(() => {
    const currentIndex = courseContent.data.lessons.findIndex(
      (lesson) => lesson.id === currentVideo.lessonId,
    );
    if (currentIndex < courseContent.data.lessons.length - 1) {
      const nextLesson = courseContent.data.lessons[currentIndex + 1];
      handleLessonChange(nextLesson);
    }
  }, [courseContent.data.lessons, currentVideo.lessonId, handleLessonChange]);

  const togglePlayPause = () => {
    const video = document.querySelector("video");
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto mb-4 size-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="flex justify-center p-8">Loading ...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex justify-center p-8">
        <Card>
          <CardContent className="p-6">Please sign in back.</CardContent>
        </Card>
      </div>
    );
  }

  let quizButtonText;
  if (isQuiz) {
    quizButtonText = "Cancel";
  } else {
    quizButtonText = quizAttempt?.passed ? "View Result" : "Start Quiz";
  }
  return (
    <div className="container mx-auto py-6">
      <div className="flex w-full justify-between">
        <h1 className="mb-6 text-3xl font-bold">{currentVideo?.title}</h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant={"default"}
              onClick={() => setIsQuiz((prev) => !prev)}
              disabled={!quizzes}
            >
              <Star className="size-5" style={{ color: "white" }} />
              {quizButtonText}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsShowCertificate(true)}
              disabled={!quizAttempt?.passed}
            >
              <ShieldCheck className="size-5" style={{ color: "white" }} />
              Certificate
            </Button>
          </div>
        </div>
      </div>
      {isQuiz ? (
        <AttemptQuiz quizDetails={quizzes} quizAttempt={quizAttempt} />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Video Player and Info Section */}

          <div className="space-y-6 lg:col-span-2">
            <Card className="p-4">
              <div className="group relative aspect-video overflow-hidden bg-muted">
                {currentVideo?.src !== "" ? (
                  <>
                    <video
                      ref={videoRef}
                      src={currentVideo.src}
                      controls
                      className="size-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                    <Button
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 p-4 text-white hover:bg-white/30"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="size-6" />
                      ) : (
                        <Play className="size-6" />
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <FileText className="mx-auto mb-2 size-12" />
                      <p className="text-lg font-medium">No video available</p>
                      <p className="text-sm">
                        This lesson contains only text content
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{currentVideo.title}</h2>
                <Button
                  variant={
                    completedLessons.has(currentVideo.lessonId)
                      ? "secondary"
                      : "default"
                  }
                  onClick={markAsComplete}
                >
                  {completedLessons.has(currentVideo.lessonId) ? (
                    <>
                      Completed <Check className="ml-2 size-4" />
                    </>
                  ) : (
                    "Mark as Complete"
                  )}
                </Button>
              </div>
            </Card>

            {/* Description and Attachments Tabs */}
            <Card className="p-4">
              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="description"
                  className="mt-4 h-[400px] overflow-y-auto pr-2"
                >
                  <div
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html:
                        currentVideo.description || "No description available.",
                    }}
                  />
                </TabsContent>

                <TabsContent
                  value="attachments"
                  className="mt-4 h-[400px] overflow-y-auto pr-2"
                >
                  <div className="grid grid-cols-1 gap-2">
                    {currentVideo?.notes && currentVideo.notes.length > 0 ? (
                      currentVideo.notes?.map((note) => (
                        <Button
                          key={note.id}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            window.open(note?.preview, "_blank");
                          }}
                        >
                          {note.type === "application/pdf" && (
                            <FileText className="mr-2 size-4" />
                          )}
                          {note.type === "application/docx" && (
                            <FileText className="mr-2 size-4" />
                          )}
                          {note.type === "zip" && (
                            <Download className="mr-2 size-4" />
                          )}
                          {note.name}
                        </Button>
                      ))
                    ) : (
                      <p>No attachments available</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Table of Contents */}
          <Card className="p-4">
            <h2 className="mb-4 text-xl font-semibold">Pilot Content</h2>
            <Progress value={progress} className="mb-4" />
            <ScrollArea className="h-[calc(100vh-200px)]">
              <ul className="space-y-2">
                {courseContent?.data?.lessons?.map((lesson) => (
                  <li key={lesson.id}>
                    <Button
                      variant={
                        lesson.id === currentVideo.lessonId
                          ? "default"
                          : "ghost"
                      }
                      className="w-full justify-start font-normal"
                      onClick={() => handleLessonChange(lesson)}
                    >
                      {completedLessons.has(lesson.id) && (
                        <Check className="mr-2 size-4 text-green-500" />
                      )}
                      {lesson.title}
                      <span className="ml-auto flex items-center text-muted-foreground">
                        <Clock className="mr-1 size-4" />
                        {lesson.duration}
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </Card>
        </div>
      )}
      <Dialog open={isShowCertificate} onOpenChange={setIsShowCertificate}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Your Certificate</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-4">
            <div ref={certificateRef}>
              <Certificate
                course={courseContent?.data?.title}
                name={
                  user?.fullName ??
                  user?.emailAddresses[0]?.emailAddress ??
                  "Pilot user"
                }
                date={dayjs(quizAttempt?.lastAttemptedAt).format("MM/DD/YYYY")}
                score={quizAttempt?.score}
              />
            </div>

            <button
              onClick={handleDownload}
              className="rounded bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
            >
              Download as PDF
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
