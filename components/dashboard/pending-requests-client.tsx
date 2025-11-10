"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateEnrollmentStatus } from "@/actions/enrollments";
import type { EnrollStatus } from "@prisma/client";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

type Enrollment = {
  id: string;
  email: string;
  pilot: string;
  pilot_id: string;
  user_id: string;
  status: EnrollStatus;
  createdAt?: string;
};

interface PendingRequestsClientProps {
  pendingEnrollments: Enrollment[];
  limit?: number;
}

export function PendingRequestsClient({
  pendingEnrollments,
  limit = 5,
}: PendingRequestsClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    enrollmentId: string | null;
    action: "approve" | "reject" | null;
  }>({
    isOpen: false,
    enrollmentId: null,
    action: null,
  });

  // Get limited number for display
  const displayEnrollments = pendingEnrollments.slice(0, limit);
  const hasMore = pendingEnrollments.length > limit;

  // Simple function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openConfirmDialog = (id: string, action: "approve" | "reject") => {
    setConfirmDialog({
      isOpen: true,
      enrollmentId: id,
      action,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      enrollmentId: null,
      action: null,
    });
  };

  const handleStatusUpdate = async () => {
    if (!confirmDialog.enrollmentId || !confirmDialog.action) return;

    const enrollmentId = confirmDialog.enrollmentId;
    const action = confirmDialog.action;

    setIsLoading(enrollmentId);
    closeConfirmDialog();

    try {
      const newStatus =
        action === "approve"
          ? ("APPROVED" as EnrollStatus)
          : ("REJECTED" as EnrollStatus);
      const result = await updateEnrollmentStatus(enrollmentId, newStatus);

      if (result.success) {
        toast({
          title: `Enrollment ${action === "approve" ? "Approved" : "Rejected"}`,
          description: `The enrollment has been successfully ${action === "approve" ? "approved" : "rejected"}.`,
          variant: "default",
        });

        // Refresh the page data
        router.refresh();
      } else {
        toast({
          title: "Action Failed",
          description: result.message || `Failed to ${action} the enrollment.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: `An error occurred while trying to ${action} the enrollment.`,
        variant: "destructive",
      });
      console.error(`Failed to ${action} enrollment:`, error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <>
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {displayEnrollments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Clock className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">
                No pending requests
              </p>
            </div>
          ) : (
            displayEnrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="flex items-center justify-between space-x-4 rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{enrollment.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {enrollment.pilot}
                  </p>
                  {enrollment.createdAt && (
                    <p className="text-xs text-muted-foreground">
                      Requested on {formatDate(enrollment.createdAt)}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-50"
                    onClick={() => openConfirmDialog(enrollment.id, "approve")}
                    disabled={isLoading === enrollment.id}
                  >
                    {isLoading === enrollment.id ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-1 h-4 w-4" />
                    )}
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => openConfirmDialog(enrollment.id, "reject")}
                    disabled={isLoading === enrollment.id}
                  >
                    {isLoading === enrollment.id ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-1 h-4 w-4" />
                    )}
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {hasMore && (
        <div className="mt-4 flex justify-center border-t pt-4">
          <Button variant="ghost" asChild className="gap-1">
            <Link href="/portal/enrollments">
              View all {pendingEnrollments.length} pending requests
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => !open && closeConfirmDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === "approve" ? "Approve" : "Reject"}{" "}
              Enrollment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmDialog.action} this enrollment
              request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeConfirmDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              variant={
                confirmDialog.action === "approve" ? "default" : "destructive"
              }
            >
              {confirmDialog.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
