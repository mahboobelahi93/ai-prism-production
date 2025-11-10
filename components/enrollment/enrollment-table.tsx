"use client";

import type { EnrollStatus } from "@prisma/client";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Enrollment = {
  id: string;
  email: string;
  pilot: string;
  pilot_id: string;
  user_id: string;
  status: EnrollStatus;
};

interface EnrollmentTableProps {
  enrollments: Enrollment[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDetails: (enrollment: Enrollment) => void;
}

export function EnrollmentTable({
  enrollments,
  onApprove,
  onReject,
  onDetails,
}: EnrollmentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User Email</TableHead>
          <TableHead>Pilot</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
          <TableHead className="text-right">Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {enrollments.map((enrollment, index) => (
          <TableRow
            key={enrollment.id}
            className={index % 2 === 0 ? "bg-muted/50" : ""}
          >
            <TableCell>
              <div className="font-medium">{enrollment.email}</div>
            </TableCell>
            <TableCell>{enrollment.pilot}</TableCell>
            <TableCell>
              <div
                className={`font-medium ${getStatusColor(enrollment.status)}`}
              >
                {enrollment.status}
              </div>
            </TableCell>
            <TableCell className="text-right">
              {enrollment.status === "PENDING" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mr-2"
                    onClick={() => onApprove(enrollment.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onReject(enrollment.id)}
                  >
                    Reject
                  </Button>
                </>
              )}
              {enrollment.status === "APPROVED" && (
                <Button size="sm" variant="outline" disabled>
                  Approved
                </Button>
              )}
              {enrollment.status === "REJECTED" && (
                <Button size="sm" variant="outline" disabled>
                  Rejected
                </Button>
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                className="inline-flex items-center text-primary hover:underline"
                onClick={() => onDetails(enrollment)}
              >
                Details <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function getStatusColor(status: EnrollStatus): string {
  switch (status) {
    case "PENDING":
      return "text-yellow-600";
    case "APPROVED":
      return "text-green-600";
    case "REJECTED":
      return "text-red-600";
    default:
      return "";
  }
}
