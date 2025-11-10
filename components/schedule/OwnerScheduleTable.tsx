"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Mail,
  MoreHorizontal,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/shared/icons";

// Define the data type for our table
type Schedule = {
  id: string;
  pilot: string;
  requestedTime: Date;
  requestedUser: string;
  requestedUserEmail: string;
  status: "PENDING" | "ACCEPTED" | "FINALIZEDVIAEMAIL";
  finalMessage?: string;
  lastUpdated: Date;
};

// Define the status badge colors
const getStatusBadge = (status: Schedule["status"]) => {
  switch (status) {
    case "ACCEPTED":
      return <Badge className="bg-green-500">Accepted</Badge>;
    case "PENDING":
      return <Badge variant="outline">Pending</Badge>;
    case "FINALIZEDVIAEMAIL":
      return <Badge className="bg-blue-500">Finalized via Email</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

type OwnerScheduleTableProps = {
  schedules: Schedule[];
  onAcceptSchedule: (id: string) => Promise<void>;
  onFinalizeSchedule: (id: string, message: string) => Promise<void>;
  loading?: boolean;
};

export default function OwnerScheduleTable({
  schedules = [],
  onAcceptSchedule,
  onFinalizeSchedule,
  loading = false,
}: OwnerScheduleTableProps) {
  // State for sorting and filtering
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Schedule;
    direction: "ascending" | "descending";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState<Schedule["status"][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null,
  );
  const [finalMessage, setFinalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 5;

  // Handle sorting
  const requestSort = (key: keyof Schedule) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Handle status filter toggle
  const toggleStatusFilter = (status: Schedule["status"]) => {
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Open accept dialog
  const openAcceptDialog = (selectedScheduleId: string) => {
    console.log("Selected schedule ID:", selectedScheduleId);
    setSelectedScheduleId(selectedScheduleId);
    setAcceptDialogOpen(true);
  };

  // Open contact dialog
  const openContactDialog = (selectedScheduleId: string) => {
    console.log("Selected schedule ID:", selectedScheduleId);
    setSelectedScheduleId(selectedScheduleId);
    setFinalMessage("");
    setContactDialogOpen(true);
  };

  // Handle accept schedule
  const handleAcceptSchedule = async (selectedScheduleId: string) => {
    try {
      console.log("Accepting schedule with ID in table:", selectedScheduleId);
      setIsSubmitting(true);
      await onAcceptSchedule(selectedScheduleId);
      toast({
        title: "Schedule accepted",
        description: "The schedule has been accepted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept the schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAcceptDialogOpen(false);
      setIsSubmitting(false);
    }
  };

  // Handle finalize schedule
  const handleFinalizeSchedule = async () => {
    if (!selectedScheduleId) return;

    try {
      setIsSubmitting(true);
      await onFinalizeSchedule(selectedScheduleId, finalMessage);
      setContactDialogOpen(false);
      toast({
        title: "Schedule finalized",
        description:
          "The schedule has been finalized and the user will be contacted via email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to finalize the schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Apply sorting and filtering
  const filteredAndSortedData = (() => {
    // First apply search filter
    let filteredData = schedules.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.pilot.toLowerCase().includes(searchLower) ||
        item.requestedUser.toLowerCase().includes(searchLower) ||
        item.requestedUserEmail.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower) ||
        (item.finalMessage &&
          item.finalMessage.toLowerCase().includes(searchLower))
      );
    });

    // Then apply status filters if any are selected
    if (statusFilters.length > 0) {
      filteredData = filteredData.filter((item) =>
        statusFilters.includes(item.status),
      );
    }

    // Then sort the data
    if (sortConfig !== null) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (aValue instanceof Date && bValue instanceof Date) {
          return sortConfig.direction === "ascending"
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "ascending"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Fallback for other types
        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  })();

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = (() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  })();

  // Get sort direction indicator
  const getSortDirectionIndicator = (key: keyof Schedule) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Schedule Requests</CardTitle>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schedules..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                  className="w-full pl-8"
                />
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Status <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {["PENDING", "ACCEPTED", "FINALIZEDVIAEMAIL"].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    className="capitalize"
                    checked={statusFilters.includes(
                      status as Schedule["status"],
                    )}
                    onCheckedChange={() =>
                      toggleStatusFilter(status as Schedule["status"])
                    }
                  >
                    {status === "PENDING"
                      ? "Pending"
                      : status === "ACCEPTED"
                        ? "Accepted"
                        : "Finalized via Email"}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort("pilot")}
                      className="flex items-center"
                    >
                      Pilot
                      {getSortDirectionIndicator("pilot")}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort("requestedTime")}
                      className="flex items-center"
                    >
                      Requested Time
                      {getSortDirectionIndicator("requestedTime")}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort("requestedUser")}
                      className="flex items-center"
                    >
                      Requested By
                      {getSortDirectionIndicator("requestedUser")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => requestSort("status")}
                      className="flex items-center"
                    >
                      Status
                      {getSortDirectionIndicator("status")}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort("lastUpdated")}
                      className="flex items-center"
                    >
                      Last Updated
                      {getSortDirectionIndicator("lastUpdated")}
                    </Button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <Icons.spinner className="mx-auto size-4 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell className="font-medium">
                        <div
                          className="max-w-[150px] truncate"
                          title={schedule.pilot}
                        >
                          {schedule.pilot}
                        </div>
                        {/* Show date on mobile */}
                        <div className="mt-1 text-xs text-muted-foreground md:hidden">
                          {format(
                            new Date(schedule.requestedTime),
                            "yyyy-MM-dd",
                          )}
                        </div>
                        {/* Show requested user email on mobile */}
                        <div className="mt-1 text-xs text-muted-foreground md:hidden">
                          {schedule.requestedUserEmail}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(
                          new Date(schedule.requestedTime),
                          "yyyy-MM-dd HH:mm",
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex flex-col">
                          <span
                            className="max-w-[150px] truncate text-xs text-muted-foreground"
                            title={schedule.requestedUserEmail}
                          >
                            {schedule.requestedUserEmail}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {format(
                          new Date(schedule.lastUpdated),
                          "yyyy-MM-dd HH:mm",
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                          {schedule.status === "PENDING" && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => openAcceptDialog(schedule.id)}
                                disabled={isSubmitting}
                              >
                                <Check className="mr-1 h-4 w-4" />
                                <span className="hidden sm:inline">Accept</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openContactDialog(schedule.id)}
                                disabled={isSubmitting}
                              >
                                <Mail className="mr-1 h-4 w-4" />
                                <span className="hidden sm:inline">
                                  Contact
                                </span>
                              </Button>
                            </>
                          )}
                          {schedule.status !== "PENDING" && (
                            <Button size="sm" variant="ghost" disabled>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {filteredAndSortedData.length > 0 && (
            <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {Math.min(
                  (currentPage - 1) * itemsPerPage + 1,
                  filteredAndSortedData.length,
                )}{" "}
                to{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredAndSortedData.length,
                )}{" "}
                of {filteredAndSortedData.length} entries
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Accept confirmation dialog */}
      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure to Accept the Schedule request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAcceptDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleAcceptSchedule(selectedScheduleId)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Later Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact User Later</DialogTitle>
            <DialogDescription>
              Add a message to let the user know you will contact them later
              about this schedule request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter your message here..."
              value={finalMessage}
              onChange={(e) => setFinalMessage(e.target.value)}
              className="min-h-[100px]"
              maxLength={200}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setContactDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleFinalizeSchedule(selectedScheduleId)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
