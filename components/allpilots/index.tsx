/**
 * This component renders a list of available pilots fetched from the API.
 *
 * - **Purpose**: To display all available pilots for users when they click on "Explore Available Pilots".
 *
 * - **Features**:
 *   1. **API Fetching**:
 *      - Fetches pilot data from `/api/allpilots` on component mount.
 *      - Displays a loading skeleton while data is being fetched.
 *      - Handles errors gracefully, showing an error message if the API call fails.
 *   2. **Pilot Information**:
 *      - Displays pilot title, category, thumbnail image, duration, participants, and industry details.
 *      - Includes a "View Details" button to navigate to a detailed pilot view using the pilot's ID.
 *   3. **Responsive Design**:
 *      - Adjusts the grid layout for different screen sizes (`1-column`, `2-columns`, or `3-columns`).
 *   4. **Fallback for Missing Data**:
 *      - If the thumbnail image is missing, a placeholder icon is displayed.
 *      - Handles optional fields like `duration`, `participants`, and `industry` dynamically.
 *
 * - **Skeleton Loading State**:
 *   - Displays a placeholder skeleton UI while data is being loaded.
 *
 * - **Error Handling**:
 *   - If an error occurs during data fetching, an error message is shown instead of the list.
 *
 * - **Usage**:
 *   - Include this component in the relevant page (e.g., `/explore`) to allow users to browse available pilots.
 *
 * - **Props**: None (currently fetching data directly inside the component).
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Briefcase, Clock, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import PilotDetailsView from "@/components/pilotdetailsview";

type Pilot = {
  id: string;
  title: string;
  description: string;
  ownerEmail: string;
  category: string;
  thumbnailFile?: {
    preview: string;
  };
  isEnrolled: boolean;
  enrollment?: {
    status: "APPROVED" | "REJECTED" | "PENDING";
    progress: number;
  };
  metrics?: {
    totalLessons: number;
    totalDuration: number;
  };
};

export default function PilotList({ pilots }: { pilots: any }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPilotId, setSelectedPilotId] = useState<string | null>(null);

  useEffect(() => {
    if (pilots) {
      setIsLoading(false);
    }
  }, [pilots]);

  if (isLoading) return <PilotListSkeleton />;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!pilots || pilots.length === 0)
    return <div className="text-center">No pilots available.</div>;

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pilots.map((pilot) => (
          <Card
            key={pilot.id}
            className="overflow-hidden transition-shadow duration-300 hover:shadow-lg"
          >
            <div className="relative aspect-video">
              {pilot?.thumbnailFile?.preview ? (
                <Image
                  src={pilot.thumbnailFile.preview}
                  alt={pilot.title}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <Briefcase className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h2 className="mb-2 line-clamp-2 text-xl font-bold">
                {pilot.title}
              </h2>
              <Badge variant="secondary" className="mb-2">
                {/* {pilot?.ownerEmail?.split("@")[0]} */}
              </Badge>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {pilot.metrics?.totalDuration &&
                    pilot.metrics.totalDuration > 0 && (
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{pilot.metrics.totalDuration} mins</span>
                      </div>
                    )}
                  {pilot.metrics?.totalLessons && (
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      <span>{pilot.metrics.totalLessons} lessons</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

            <div className="mt-auto">
              {/* Progress Bar Section */}
              <div className="border-t px-4 py-3">
                {pilot.isEnrolled && pilot.enrollment ? (
                  <>
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm font-medium">
                        {pilot.enrollment.progress}%
                      </span>
                    </div>
                    <Progress
                      value={pilot.enrollment.progress}
                      className="w-full"
                    />
                  </>
                ) : (
                  <div className="h-[48px]">
                    {" "}
                    {/* Reserve space for the progress bar */}
                    <span className="invisible">No progress</span>
                  </div>
                )}
              </div>
              <CardFooter className="flex items-center justify-between bg-muted p-4">
                <div className="flex-1">
                  {pilot.isEnrolled && pilot.enrollment ? (
                    <Badge
                      variant={
                        pilot.enrollment.status === "APPROVED"
                          ? "success"
                          : pilot.enrollment.status === "REJECTED"
                            ? "destructive"
                            : "default"
                      }
                    >
                      {pilot.enrollment.status}
                    </Badge>
                  ) : (
                    <span className="invisible">placeholder</span>
                  )}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="link"
                      className="ml-auto"
                      onClick={() => setSelectedPilotId(pilot.id)}
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="ml-2 size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                    <PilotDetailsView pilotId={pilot.id} />
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function PilotListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <CardContent className="p-4">
            <Skeleton className="mb-2 h-6 w-3/4" />
            <Skeleton className="mb-4 h-4 w-1/4" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-9 w-28" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
