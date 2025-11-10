"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, Eye, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { formatDuration } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
}

interface PilotDetails {
  id: string;
  title: string;
  category: string;
  totalDuration: number;
  isPublished: boolean;
  thumbnailFile?: { preview: string };
  lessons?: Lesson[];
  description: string;
}

interface PilotDetailsProps {
  pilotDetails: PilotDetails;
}

export default function PilotDetails({ pilotDetails }: PilotDetailsProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleViewContent = () => {
    router.push(`/portal/pilots/contents/${pilotDetails?.id}`);
  };

  const handlePublishToggle = () => {
    setShowDialog(true);
  };

  const confirmAction = async () => {
    if (!pilotDetails) return;

    setIsUpdating(true);
    try {
      const response = await fetch("/api/pilots/updatePublishStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pilotId: pilotDetails.id,
          isPublished: !pilotDetails.isPublished,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      toast.success(
        `Pilot ${pilotDetails.isPublished ? "unpublished" : "published"} successfully`,
      );
      setShowDialog(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update publish status:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const lessons = pilotDetails?.lessons || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            <div className="grid gap-0 lg:grid-cols-5">
              {/* Image Section */}
              <div className="relative lg:col-span-2">
                <div className="aspect-[4/3] lg:aspect-auto lg:h-full">
                  <img
                    src={
                      pilotDetails?.thumbnailFile?.preview || "/placeholder.svg"
                    }
                    alt={pilotDetails?.title || "Pilot thumbnail"}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col justify-between p-8 lg:col-span-3 lg:p-12">
                <div>
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="px-3 py-1 text-sm font-medium"
                    >
                      {pilotDetails.category}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(pilotDetails?.totalDuration)}</span>
                    </div>
                  </div>

                  <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                    {pilotDetails?.title}
                  </h1>

                  <div
                    className="text-pretty text-lg leading-relaxed text-muted-foreground"
                    dangerouslySetInnerHTML={{
                      __html:
                        pilotDetails?.description?.length > 300
                          ? `${pilotDetails.description.substring(0, 300)}...`
                          : pilotDetails?.description || "",
                    }}
                  />
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={handleViewContent}
                  >
                    <Eye className="h-4 w-4" />
                    View Lessons
                  </Button>
                  <Button
                    size="lg"
                    variant={pilotDetails?.isPublished ? "outline" : "default"}
                    onClick={handlePublishToggle}
                    className="gap-2"
                    disabled={isUpdating}
                  >
                    <Globe className="h-4 w-4" />
                    {pilotDetails?.isPublished ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground">
              Lessons
            </h2>
            <p className="mt-2 text-muted-foreground">
              {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"} to
              help you master {pilotDetails?.title}
            </p>
          </div>

          {lessons.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-3">
              {lessons.map((lesson, index) => (
                <AccordionItem
                  key={lesson.id}
                  value={lesson.id}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <AccordionTrigger className="px-6 py-5 text-left hover:no-underline [&[data-state=open]]:bg-muted/50">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent font-semibold text-accent-foreground">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-balance text-lg font-semibold text-foreground">
                          {lesson.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(lesson.duration)}</span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-2">
                    <div
                      className="ml-14 text-pretty leading-relaxed text-muted-foreground"
                      dangerouslySetInnerHTML={{
                        __html:
                          lesson.description?.length > 500
                            ? `${lesson.description.substring(0, 500)}...`
                            : lesson.description || "No description available.",
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
              <div className="text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  No lessons available yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add lessons to get started with your pilot
                </p>
              </div>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm lg:p-12">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground">
            About This Pilot
          </h2>
          <div
            className="text-pretty text-lg leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: pilotDetails?.description || "",
            }}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pilotDetails?.isPublished ? "Unpublish Pilot" : "Publish Pilot"}
            </DialogTitle>
            <DialogDescription>
              {pilotDetails?.isPublished
                ? "Are you sure you want to unpublish this pilot? It will no longer be visible to users."
                : "Are you sure you want to publish this pilot? It will be visible to all users."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={confirmAction} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : pilotDetails?.isPublished ? (
                "Unpublish"
              ) : (
                "Publish"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
