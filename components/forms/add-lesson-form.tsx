"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { deleteLesson, handleLessonCreationOrUpdate } from "@/actions/lessons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CONSTANTS } from "@/lib/constants";
import { lessonFormSchema } from "@/lib/validations/pilots";
import { useUploadFile } from "@/hooks/use-upload-file";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { toast } from "../ui/use-toast";
import FormFileUploader from "./form-file-uploader";
import FormInput from "./form-input";
import FormRichTextInput from "./form-rich-text-input";

// Proper typing
type Lesson = z.infer<typeof lessonFormSchema> & { id: string };

interface AddLessonFormProps {
  existingLessons: Lesson[];
  pilotId: string;
}

export default function AddLessonForm({
  existingLessons,
  pilotId,
}: AddLessonFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>(existingLessons);
  const [isPending, startTransition] = useTransition();
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const { uploadFileToS3Direct, UploadFileContextProvider } = useUploadFile();

  // Sync with prop changes
  useEffect(() => {
    setLessons(existingLessons);
  }, [existingLessons]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const form = useForm<z.infer<typeof lessonFormSchema>>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      tutorialVideo: undefined,
      description: "",
      isPublished: false,
      duration: "",
      notes: [],
    },
  });

  const openModal = (lesson: Lesson | null = null) => {
    if (isPending) return; // Prevent opening during save

    if (lesson) {
      // Safely map lesson to form schema
      form.reset({
        title: lesson.title || "",
        description: lesson.description || "",
        duration: lesson.duration || "",
        isPublished: lesson.isPublished ?? false,
        tutorialVideo: lesson.tutorialVideo,
        notes: lesson.notes || [],
      });
    } else {
      form.reset({
        title: "",
        tutorialVideo: undefined,
        description: "",
        isPublished: false,
        duration: "",
        notes: [],
      });
    }
    setCurrentLesson(lesson);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isPending) {
      toast({
        title: "Warning",
        description: "Please wait for the upload to complete.",
        variant: "destructive",
      });
      return;
    }

    setIsModalOpen(false);
    setCurrentLesson(null);
    setUploadProgress({});
    form.reset();
  };

  const uploadFiles = async (
    files: File[],
    fileType: string,
  ): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const progressKey = `${fileType}-${i}`;

      try {
        setUploadProgress((prev) => ({ ...prev, [progressKey]: 0 }));

        const uploadedResult = await uploadFileToS3Direct(
          file,
          fileType === "notes"
            ? CONSTANTS.FILE_CLASS_TYPE.TUTORIAL_NOTE
            : CONSTANTS.FILE_CLASS_TYPE.TUTORIAL_VIDEO,
        );

        if (!uploadedResult) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        uploadedUrls.push(uploadedResult);
        setUploadProgress((prev) => ({ ...prev, [progressKey]: 100 }));
      } catch (error) {
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[progressKey];
          return newProgress;
        });
        throw new Error(
          `Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }

    return uploadedUrls;
  };

  const onSubmit = async (data: z.infer<typeof lessonFormSchema>) => {
    if (isPending) return;

    abortControllerRef.current = new AbortController();
    const previousLessons = [...lessons];

    startTransition(async () => {
      try {
        const formData = new FormData();

        // Handle file uploads separately
        if (data.tutorialVideo && Array.isArray(data.tutorialVideo)) {
          const videoFiles = data.tutorialVideo.filter(
            (item): item is File => item instanceof File,
          );

          if (videoFiles.length > 0) {
            const uploadedVideos = await uploadFiles(
              videoFiles,
              "tutorialVideo",
            );
            uploadedVideos.forEach((url) =>
              formData.append("tutorialVideo", url),
            );
          }
        }

        if (data.notes && Array.isArray(data.notes)) {
          const noteFiles = data.notes.filter(
            (item): item is File => item instanceof File,
          );

          if (noteFiles.length > 0) {
            const uploadedNotes = await uploadFiles(noteFiles, "notes");
            uploadedNotes.forEach((url) => formData.append("notes", url));
          }
        }

        // Append other form fields
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("duration", String(data.duration));
        formData.append("isPublished", String(data.isPublished));
        formData.append("pilotId", pilotId);

        if (currentLesson) {
          formData.append("id", currentLesson.id);
        }

        const result = await handleLessonCreationOrUpdate(formData);

        if (!result.success) {
          throw new Error(result.message || "Failed to save lesson");
        }

        toast({
          title: "Success",
          description: `Lesson "${data.title}" saved successfully`,
        });

        // Update with server response, not form data
        if (currentLesson) {
          setLessons((prev) =>
            prev.map((lesson) =>
              lesson.id === currentLesson.id ? result.data : lesson,
            ),
          );
        } else {
          setLessons((prev) => [...prev, result.data]);
        }

        closeModal();
      } catch (error) {
        // Rollback on error
        setLessons(previousLessons);

        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "An error occurred while saving the lesson.",
          variant: "destructive",
        });
      } finally {
        setUploadProgress({});
        abortControllerRef.current = null;
      }
    });
  };

  const handleDeleteLesson = async (id: string) => {
    if (deletingLessonId) return;

    setDeletingLessonId(id);
    const previousLessons = [...lessons];

    // Optimistic update
    setLessons((prev) => prev.filter((lesson) => lesson.id !== id));

    try {
      const response = await deleteLesson(id, pilotId);

      if (!response.success) {
        throw new Error(response.message || "Failed to delete lesson");
      }

      toast({
        title: "Success",
        description: "Lesson deleted successfully.",
      });
    } catch (error) {
      // Rollback
      setLessons(previousLessons);

      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete lesson",
        variant: "destructive",
      });
    } finally {
      setDeletingLessonId(null);
    }
  };

  const hasUploads = Object.keys(uploadProgress).length > 0;

  return (
    <Card>
      <CardHeader className="flex w-full flex-row items-center justify-between">
        <CardTitle>Lessons ({lessons.length})</CardTitle>
        <Button onClick={() => openModal()} disabled={isPending}>
          <PlusCircle className="mr-2 size-4" />
          Add New Lesson
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 pt-6">
        {lessons.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No lessons yet. Click &quot;Add New Lesson&quot; to get started.
          </p>
        ) : (
          lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div>
                <p className="font-medium">
                  Lesson {index + 1}: {lesson.title || "Untitled"}
                </p>
                {lesson.duration && (
                  <p className="text-sm text-gray-500">
                    {lesson.duration} minutes
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal(lesson)}
                  disabled={isPending || deletingLessonId === lesson.id}
                  aria-label={`Edit ${lesson.title}`}
                >
                  <Pencil className="size-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingLessonId !== null}
                      aria-label={`Delete ${lesson.title}`}
                    >
                      {deletingLessonId === lesson.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Lesson?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete &quot;{lesson.title}&quot; and all
                        associated files. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </CardContent>

      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent
          className="max-h-[90vh] max-w-3xl overflow-y-auto lg:max-w-screen-lg"
          onInteractOutside={(e) => {
            if (isPending) {
              e.preventDefault();
              toast({
                title: "Please wait",
                description: "Upload in progress...",
              });
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {currentLesson ? "Edit Lesson" : "Add New Lesson"}
            </DialogTitle>
          </DialogHeader>

          {hasUploads && (
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-900">
                Uploading files...
              </p>
              <div className="mt-2 space-y-1">
                {Object.entries(uploadProgress).map(([key, progress]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-blue-200">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-blue-900">{progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Form {...form}>
            <UploadFileContextProvider>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormInput
                  inputName="title"
                  labelName="Lesson Title"
                  maxLength={100}
                />
                <FormRichTextInput
                  inputName="description"
                  labelName="Content"
                />
                <FormFileUploader
                  inputName="tutorialVideo"
                  labelName="Add Tutorial Video"
                  description="Supports MP4 up to 100MB"
                  accept={{
                    "video/mp4": [".mp4"],
                  }}
                  maxSize={100}
                />
                <FormFileUploader
                  inputName="notes"
                  labelName="Add Notes"
                  description="Supports PDFs up to 10MB"
                  accept={{
                    "application/pdf": [".pdf"],
                  }}
                  maxFileCount={5}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          min={0}
                          max={100}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        {hasUploads ? "Uploading..." : "Saving..."}
                      </>
                    ) : currentLesson ? (
                      "Update Lesson"
                    ) : (
                      "Save Lesson"
                    )}
                  </Button>
                </div>
              </form>
            </UploadFileContextProvider>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
