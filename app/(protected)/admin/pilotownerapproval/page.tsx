"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle,
  Clock,
  Filter,
  Loader2,
  Mail,
  MoreHorizontal,
  Search,
  Users,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { toast } from "@/components/ui/use-toast";

export default function PilotOwnerRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const data = await fetch("/api/admin/pilot-owner-requests").then((res) =>
      res.json(),
    );
    setRequests(data);
  };

  const processRequest = async (request, action) => {
    try {
      setIsLoading(action);
      const endpoint =
        action === "approve"
          ? `/api/admin/pilot-owner-requests/${request.id}/approve`
          : `/api/admin/pilot-owner-requests/${request.id}/reject`;

      const result = await fetch(endpoint, {
        method: "POST",
      });

      if (result.ok) {
        toast({
          title: "Success",
          description: `Pilot owner request ${action}d successfully. Email notification sent.`,
        });
        fetchRequests();
      } else {
        throw new Error("Failed to process request");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process pilot owner request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null); // Reset loading state
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.organization?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    const pending = requests.filter((r) => r.status === "PENDING").length;
    const approved = requests.filter((r) => r.status === "APPROVED").length;
    const rejected = requests.filter((r) => r.status === "REJECTED").length;
    return { pending, approved, rejected, total: requests.length };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen space-y-6 bg-background p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Pilot Owner Requests
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage and review pilot owner applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Requests
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.total}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="text-warning h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.pending}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-success h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Approved
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.approved}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <XCircle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Rejected
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stats.rejected}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-semibold text-foreground">
              Applications
            </CardTitle>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-border bg-input pl-10 sm:w-64"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-border bg-transparent"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {statusFilter === "ALL" ? "All Status" : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-border bg-popover">
                  <DropdownMenuItem onClick={() => setStatusFilter("ALL")}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("PENDING")}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("APPROVED")}>
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("REJECTED")}>
                    Rejected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="font-medium text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Name</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4" />
                      <span>Organization</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="font-medium text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      {searchTerm || statusFilter !== "ALL"
                        ? "No requests match your filters"
                        : "No requests found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow
                      key={request.id}
                      className="border-border transition-colors hover:bg-muted/30"
                    >
                      <TableCell className="font-medium text-foreground">
                        {request.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {request.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {request.organization}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "APPROVED"
                              ? "default"
                              : request.status === "REJECTED"
                                ? "destructive"
                                : "secondary"
                          }
                          className={
                            request.status === "APPROVED"
                              ? "bg-success text-success-foreground hover:bg-success/80"
                              : request.status === "REJECTED"
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive/80"
                                : "bg-warning text-warning-foreground hover:bg-warning/80"
                          }
                        >
                          {request.status === "APPROVED" && (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          )}
                          {request.status === "REJECTED" && (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {request.status === "PENDING" && (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.status === "PENDING" ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => processRequest(request, "approve")}
                              className="bg-success hover:bg-success/80 text-success-foreground"
                              disabled={isLoading !== null}
                            >
                              {isLoading === "approve" ? (
                                <>
                                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-1 h-4 w-4" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => processRequest(request, "reject")}
                              className="bg-destructive hover:bg-destructive/80"
                              disabled={isLoading !== null}
                            >
                              {isLoading === "reject" ? (
                                <>
                                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <XCircle className="mr-1 h-4 w-4" />
                                  Reject
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm"></Button>
                            </DropdownMenuTrigger>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
