"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type StatusCounts = {
  ALL: number;
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
};

interface EnrollmentStatusTabsProps {
  statusFilter: string;
  statusCounts: StatusCounts;
  onStatusChange: (status: string) => void;
}

export function EnrollmentStatusTabs({
  statusFilter,
  statusCounts,
  onStatusChange,
}: EnrollmentStatusTabsProps) {
  return (
    <Tabs
      defaultValue="ALL"
      value={statusFilter}
      onValueChange={onStatusChange}
      className="w-full"
    >
      <TabsList className="mb-4 grid grid-cols-4">
        <TabsTrigger
          value="ALL"
          className="flex items-center justify-center gap-2"
        >
          All
          <Badge variant="secondary" className="ml-1">
            {statusCounts.ALL}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value="PENDING"
          className="flex items-center justify-center gap-2"
        >
          Pending
          <Badge
            variant="secondary"
            className="ml-1 bg-yellow-100 text-yellow-800"
          >
            {statusCounts.PENDING}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value="APPROVED"
          className="flex items-center justify-center gap-2"
        >
          Approved
          <Badge
            variant="secondary"
            className="ml-1 bg-green-100 text-green-800"
          >
            {statusCounts.APPROVED}
          </Badge>
        </TabsTrigger>
        <TabsTrigger
          value="REJECTED"
          className="flex items-center justify-center gap-2"
        >
          Rejected
          <Badge variant="secondary" className="ml-1 bg-red-100 text-red-800">
            {statusCounts.REJECTED}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
