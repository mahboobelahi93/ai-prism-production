"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { enrollInPilot, getUserEnrollmentStatus } from "@/actions/enrollments";
import { getPilotDetailsById } from "@/actions/pilots";
import { EnrollStatus } from "@prisma/client";
import { Clock, Mail, ShieldCheck, Star, User } from "lucide-react";

import { formatDuration } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  tutorialVideo?: {
    preview: string;
  };
}

interface PilotDetails {
  id: string;
  title: string;
  description: string;
  thumbnailFile?: {
    preview: string;
  };
  category?: string;
  lessons?: Lesson[];
  owner?: {
    name: string;
    email: string;
    avatar?: string;
  };
  isSubscribed?: boolean;
  isApproved?: boolean;
}

export default function PilotDetailsView({ pilotId }: { pilotId: string }) {
  const router = useRouter();
  const [pilotDetails, setPilotDetails] = useState<PilotDetails | null>(null);
  const [enrollStatus, setEnrollStatus] = useState<
    EnrollStatus | null | undefined
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isEnrollLoading, setIsEnrollLoading] = useState(true);

  useEffect(() => {
    if (!pilotId) {
      setIsLoading(false);
      setEnrollStatus(null);
      return;
    }

    const fetchData = async () => {
      try {
        const [detailsResponse, enrollmentStatus] = await Promise.all([
          getPilotDetailsById(pilotId),
          getUserEnrollmentStatus(pilotId),
        ]);

        // Handle pilot details
        if (detailsResponse.success && detailsResponse.data) {
          setPilotDetails(detailsResponse?.data);
        } else {
          throw new Error(
            detailsResponse.message || "Failed to fetch pilot details",
          );
        }

        // Set enrollment status
        setEnrollStatus(enrollmentStatus);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pilotId]);

  const handleViewContent = () => {
    router.push(`/portal/pilots/contents/${pilotId}`);
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    const result = await enrollInPilot(pilotId);

    setIsSubscribing(false);
    if (result.success) {
      // Refetch the enrollment status from the backend
      const status = await getUserEnrollmentStatus(pilotId);
      setEnrollStatus(status);
      setShowDialog(false);
    } else {
      // Handle error (e.g., show a message to the user)
      console.error(result.message);
    }
  };

  const renderActionButton = () => {
    // Show loading only when actually loading (undefined = not yet loaded, null = loaded but not enrolled)
    if (isLoading || enrollStatus === undefined) {
      return (
        <Button disabled className="mt-6 w-full">
          Loading...
        </Button>
      );
    }
    if (enrollStatus === null) {
      return (
        <>
          <Button onClick={() => setShowDialog(true)} className="mt-6 w-full">
            Subscribe
          </Button>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Subscription</DialogTitle>
                <DialogDescription>
                  Are you sure you want to subscribe to this pilot?
                </DialogDescription>
              </DialogHeader>
              <Button onClick={handleSubscribe} disabled={isSubscribing}>
                {isSubscribing ? "Subscribing..." : "Confirm Subscription"}
              </Button>
            </DialogContent>
          </Dialog>
        </>
      );
    } else if (enrollStatus === "PENDING") {
      return (
        <Button disabled className="mt-6 w-full">
          Waiting for Approval
        </Button>
      );
    } else if (enrollStatus === "APPROVED") {
      return (
        <Button onClick={handleViewContent} className="mt-6 w-full">
          Continue Learning
        </Button>
      );
    } else if (enrollStatus === "REJECTED") {
      return (
        <Button disabled className="mt-6 w-full">
          Enrollment Rejected
        </Button>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 overflow-hidden">
          <div className="grid md:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg p-4 lg:col-span-2">
              <div className="h-full w-full animate-pulse rounded-lg bg-gray-200" />
            </div>
            <div className="flex flex-col justify-between p-6 lg:col-span-3">
              <div>
                <div className="mb-4 h-4 w-1/2 animate-pulse bg-gray-200" />
                <div className="mb-4 h-8 w-3/4 animate-pulse bg-gray-200" />
                <div className="mb-6 h-16 w-full animate-pulse bg-gray-200" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!pilotDetails) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        Failed to load pilot details.
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container py-8">
        <h2 className="mb-6 text-lg font-semibold">PILOT DETAILS</h2>

        {/* Pilot Hero Section */}
        <Card className="mb-8 overflow-hidden border-gray-700">
          <div className="grid md:grid-cols-2 lg:grid-cols-5">
            {/* Left: Thumbnail */}
            <div className="rounded-lg p-4 lg:col-span-2">
              {pilotDetails.thumbnailFile?.preview ? (
                <Image
                  src={pilotDetails.thumbnailFile.preview}
                  alt="Pilot Thumbnail"
                  width={600}
                  height={400}
                  className="size-full rounded-lg object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-lg bg-gray-800" />
              )}
            </div>

            {/* Right: Info + Action Button */}
            <div className="flex flex-col justify-between p-6 lg:col-span-3">
              <div>
                <div className="mb-4 text-sm text-muted-foreground">
                  Getting started with {pilotDetails.title}
                </div>
                <h1 className="mb-4 text-2xl font-bold">
                  {pilotDetails.title}
                </h1>
                {pilotDetails.category && (
                  <Badge>{pilotDetails.category}</Badge>
                )}

                {/* Icons row */}
                <div className="mt-4 flex items-center gap-4">
                  {/* Total Duration (if available) */}
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" style={{ color: "#1E8CA3" }} />
                    <span>{formatDuration(pilotDetails?.totalDuration)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" disabled>
                      <Star className="mr-1 h-4 w-4" />
                      Quiz
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" disabled>
                      <ShieldCheck className="mr-1 h-4 w-4" />
                      Certificate
                    </Button>
                  </div>
                </div>
              </div>

              {/* Dynamic action button (Subscribe, Waiting, Continue, etc.) */}
              <div>{renderActionButton()}</div>
            </div>
          </div>
        </Card>

        {/* Course Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-lg font-semibold">Lessons</h2>
            <Card className="border border-gray-700">
              {pilotDetails?.lessons && pilotDetails.lessons.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {pilotDetails?.lessons.map((lesson, i) => (
                    <AccordionItem value={`item-${i}`} key={lesson.id}>
                      <AccordionTrigger className="px-6 py-4 hover:bg-blue-100 hover:no-underline">
                        <div className="flex w-full items-center justify-between">
                          <span className="font-medium">
                            LESSON {i + 1}: {lesson.title}
                          </span>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="size-4" />
                            <span>{formatDuration(lesson.duration)}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 text-gray-300">
                        {lesson.description ? (
                          <div
                            className="space-y-4 text-muted-foreground"
                            dangerouslySetInnerHTML={{
                              __html: lesson.description,
                            }}
                          ></div>
                        ) : (
                          <p>No description available.</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="p-6 text-gray-400">No lessons available.</div>
              )}
            </Card>
          </div>

          {/* Pilot Owner Card */}
          <div>
            <h2 className="mb-6 text-lg font-semibold">PILOT OWNER</h2>
            <Card className="p-6">
              <div className="flex flex-col items-center text-center">
                <p className="mb-6 text-sm text-muted-foreground">
                  {pilotDetails?.ownerEmail?.split("@")[0]}
                </p>
                <div className="flex gap-4">
                  <div
                    className="flex cursor-pointer items-center"
                    onClick={() =>
                      navigator.clipboard.writeText(pilotDetails?.ownerEmail)
                    }
                    title="Click to copy"
                  >
                    <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span>{pilotDetails?.ownerEmail}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* About Pilot */}
        <div className="mt-8">
          <h2 className="mb-6 text-lg font-semibold">ABOUT PILOT</h2>
          <Card className="max-h-60 overflow-y-auto p-6">
            <h3 className="mb-4 text-xl font-bold">{pilotDetails.title}</h3>
            <div
              className="space-y-4 text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html:
                  pilotDetails.description ||
                  "No additional details available.",
              }}
            />
          </Card>
        </div>
      </main>
    </div>
  );
}
