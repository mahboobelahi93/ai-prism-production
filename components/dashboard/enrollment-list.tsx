"use client";

import { useEffect, useState } from "react";
import {
  getAllEnrollments,
  updateEnrollmentStatus,
} from "@/actions/enrollments";
import { getUserProgressForPilot } from "@/actions/lessonprogress";
import type { EnrollStatus } from "@prisma/client";
import { Loader } from "lucide-react";

import type { Enrollment, StatusCounts } from "@/types/enrollment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EnrollmentEmptyState } from "@/components/enrollment/enrollment-empty-state";
import { EnrollmentPagination } from "@/components/enrollment/enrollment-pagination";
import { EnrollmentStatusTabs } from "@/components/enrollment/enrollment-status-tab";
import { EnrollmentTable } from "@/components/enrollment/enrollment-table";
import PilotUserProfile from "@/components/pilotuserprofile";

type EnrollmentListProps = {
  pilot_id: string;
  limit?: number;
  showPagination?: boolean;
};

export function EnrollmentList({
  pilot_id,
  limit = 10,
  showPagination = true,
}: EnrollmentListProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    enrollmentId: string | null;
    action: "approve" | "reject" | null;
  }>({
    isOpen: false,
    enrollmentId: null,
    action: null,
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<any | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(limit);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    ALL: 0,
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
  });

  const totalPages = Math.ceil(totalItems / pageSize);

  useEffect(() => {
    fetchEnrollments();
  }, [currentPage, pageSize, pilot_id, statusFilter]);

  const fetchEnrollments = async () => {
    const isInitialLoad = isLoading;
    if (!isInitialLoad) {
      setIsPaginationLoading(true);
    }

    try {
      const response = await getAllEnrollments();

      // First filter by pilot_id if provided
      let filteredByPilot = response;
      if (pilot_id) {
        filteredByPilot = response.filter(
          (enrollment) => enrollment.pilot_id === pilot_id,
        );
      }

      // Calculate counts for each status
      const counts = {
        ALL: filteredByPilot.length,
        PENDING: filteredByPilot.filter((e) => e.status === "PENDING").length,
        APPROVED: filteredByPilot.filter((e) => e.status === "APPROVED").length,
        REJECTED: filteredByPilot.filter((e) => e.status === "REJECTED").length,
      };
      setStatusCounts(counts);

      // Then apply status filter if not "ALL"
      let filteredEnrollments = filteredByPilot;
      if (statusFilter !== "ALL") {
        filteredEnrollments = filteredByPilot.filter(
          (enrollment) => enrollment.status === statusFilter,
        );
      }

      setTotalItems(filteredEnrollments.length);

      // Calculate pagination slice
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = Math.min(
        startIndex + pageSize,
        filteredEnrollments.length,
      );
      const paginatedEnrollments = filteredEnrollments.slice(
        startIndex,
        endIndex,
      );

      setEnrollments(paginatedEnrollments);
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    } finally {
      setIsLoading(false);
      setIsPaginationLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number.parseInt(value);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const openModal = (id: string, action: "approve" | "reject") => {
    setModalState({ isOpen: true, enrollmentId: id, action });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, enrollmentId: null, action: null });
  };

  const handleStatusUpdate = async () => {
    if (!modalState.enrollmentId || !modalState.action) return;

    const newStatus =
      modalState.action === "approve"
        ? ("APPROVED" as EnrollStatus)
        : ("REJECTED" as EnrollStatus);
    try {
      const result = await updateEnrollmentStatus(
        modalState.enrollmentId,
        newStatus,
      );

      if (result.success) {
        setEnrollments((prevEnrollments) =>
          prevEnrollments.map((enrollment) =>
            enrollment.id === modalState.enrollmentId
              ? { ...enrollment, status: newStatus }
              : enrollment,
          ),
        );

        // Update status counts
        setStatusCounts((prev) => ({
          ...prev,
          [newStatus]: prev[newStatus] + 1,
          PENDING: prev.PENDING - 1,
        }));

        // Refresh data if needed
        if (statusFilter !== "ALL" && statusFilter !== newStatus) {
          fetchEnrollments();
        }
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Failed to update enrollment status:", error);
    } finally {
      closeModal();
    }
  };

  const handleDetailsClick = async (enrollment: Enrollment) => {
    setSelectedUserId(enrollment.user_id);
    try {
      const result = await getUserProgressForPilot(enrollment.pilot_id);
      setUserProgress(result.progress);
      setIsProfileOpen(true);
    } catch (error) {
      console.error("Error getting user progress for pilot:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading enrollments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EnrollmentStatusTabs
        statusFilter={statusFilter}
        statusCounts={statusCounts}
        onStatusChange={handleStatusChange}
      />

      {enrollments.length === 0 ? (
        <EnrollmentEmptyState statusFilter={statusFilter} />
      ) : (
        <div className="relative">
          {isPaginationLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <EnrollmentTable
            enrollments={enrollments}
            onApprove={(id) => openModal(id, "approve")}
            onReject={(id) => openModal(id, "reject")}
            onDetails={handleDetailsClick}
          />
        </div>
      )}

      {showPagination && totalItems > 0 && (
        <EnrollmentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <Dialog open={modalState.isOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalState.action === "approve"
                ? "Approve Enrollment"
                : "Reject Enrollment"}
            </DialogTitle>
            <DialogDescription>{`Are you sure you want to ${modalState.action} this enrollment?`}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>
              {modalState.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          {selectedUserId && (
            <PilotUserProfile
              userData={{
                id: selectedUserId,
                email:
                  enrollments.find((e) => e.user_id === selectedUserId)
                    ?.email || "",
                pilot: {
                  id:
                    enrollments.find((e) => e.user_id === selectedUserId)
                      ?.pilot_id || "",
                  title:
                    enrollments.find((e) => e.user_id === selectedUserId)
                      ?.pilot || "",
                },
                status:
                  enrollments.find((e) => e.user_id === selectedUserId)
                    ?.status || "",
                progress: userProgress,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
