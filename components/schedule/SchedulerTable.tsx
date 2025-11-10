"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Icons } from "@/components/shared/icons";

// Define the data type for our table
type Schedule = {
  id: string;
  pilot: string;
  requestedTime: Date;
  pilotowner: string;
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

export default function Schedulerable({
  schedules,
  loading,
}: {
  schedules: Schedule[];
  loading: boolean;
}) {
  // State for sorting and filtering
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Schedule;
    direction: "ascending" | "descending";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState<Schedule["status"][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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

  // Apply sorting and filtering
  const filteredAndSortedData = useMemo(() => {
    // First apply search filter
    let filteredData = schedules.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.pilot.toLowerCase().includes(searchLower) ||
        item.pilotowner.toLowerCase().includes(searchLower) ||
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
  }, [schedules, searchTerm, statusFilters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Schedule Requests</CardTitle>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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
              <Button variant="outline" className="ml-auto">
                Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["PENDING", "ACCEPTED", "FINALIZEDVIAEMAIL"].map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  className="capitalize"
                  checked={statusFilters.includes(status as Schedule["status"])}
                  onCheckedChange={() =>
                    toggleStatusFilter(status as Schedule["status"])
                  }
                >
                  {status}
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
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("pilot")}
                    className="flex items-center"
                  >
                    Pilot
                    {getSortDirectionIndicator("pilot")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("requestedTime")}
                    className="flex items-center"
                  >
                    Requested Time
                    {getSortDirectionIndicator("requestedTime")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("pilotowner")}
                    className="flex items-center"
                  >
                    PO Email
                    {getSortDirectionIndicator("pilotowner")}
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
                <TableHead>Final Message</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("lastUpdated")}
                    className="flex items-center"
                  >
                    Last Updated
                    {getSortDirectionIndicator("lastUpdated")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <Icons.spinner className="mx-auto size-4 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No schedules found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{schedule.pilot}</TableCell>
                    <TableCell>
                      {new Date(schedule.requestedTime).toLocaleString()}
                    </TableCell>
                    <TableCell>{schedule.pilotownerEmail}</TableCell>
                    <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                    <TableCell>{schedule.finalMessage || "-"}</TableCell>
                    <TableCell>
                      {new Date(schedule.lastUpdated).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {filteredAndSortedData.length > 0 && (
          <div className="flex items-center justify-between space-x-2 py-4">
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
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
  );
}
