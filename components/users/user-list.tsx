"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { changeUserRole, deleteUser, suspendUser } from "@/actions/users";
import type { User } from "@prisma/client";
import { set } from "date-fns";
import {
  AlertTriangle,
  Copy,
  Download,
  Edit,
  Eye,
  Filter,
  Key,
  Mail,
  MoreHorizontal,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Users,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Textarea } from "../ui/textarea";

interface UserListTableProps {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  roleFilter: string | null;
  currentUrl?: string;
  loading?: boolean;
}

export default function UserListTable({
  data = [],
  total,
  page,
  pageSize,
  search,
  roleFilter,
  currentUrl = "/users",
}: UserListTableProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(search);
  const [users, setUsers] = useState<User[]>(data);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });
  const [suspendDialog, setSuspendDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });
  const [roleDialog, setRoleDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const totalPages = Math.ceil(total / pageSize);
  const [loading, setLoading] = useTransition();
  useEffect(() => {
    setUsers(data);
    console.log("Data updated:", data);
  }, [data]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue !== search) {
        updateParams({ page: 1, search: searchValue, role: roleFilter });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  function updateParams(params: Record<string, string | number | null>) {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.search !== undefined) query.set("search", String(params.search));
    if (params.role) query.set("role", String(params.role));
    setLoading(() => {
      router.push(`${currentUrl}?${query.toString()}`);
    });
  }

  const getRoleVariant = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "destructive";
      case "PILOTOWNER":
        return "default";
      case "USER":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleViewUser = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleEditUser = (userId: string) => {
    router.push(`admin/userview/${userId}/edit`);
  };

  // Delete user
  const handleDeleteUser = async (user: User) => {
    setActionLoading(`delete-${user.id}`);
    try {
      const res = await deleteUser(user.id, deletePassword);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id)); // optimistic
        toast.success("User deleted successfully.");
      } else {
        router.refresh(); // fallback refetch
        toast.error(res.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      router.refresh();
      toast.error("An error occurred. Please try again.");
    } finally {
      setActionLoading(null);
      setDeleteDialog({ open: false, user: null });
    }
  };

  // Suspend / Activate
  const handleSuspendUser = async (user: User) => {
    setActionLoading(`suspend-${user.id}`);
    try {
      const res = await suspendUser({
        userId: user.id,
        suspend: user.isActive, // if active, suspend
        reason: user.isActive ? suspendReason : "",
      });
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, isActive: !u.isActive } : u,
          ),
        );
        toast.success(
          `User has been ${user.isActive ? "suspended" : "activated"}.`,
        );
      } else {
        router.refresh();
        toast.error(res.message || "Failed to update user status.");
      }
    } catch (error) {
      console.error("Suspend/Activate failed:", error);
      router.refresh();
      toast.error("An error occurred. Please try again.");
    } finally {
      setActionLoading(null);
      setSuspendDialog({ open: false, user: null });
      setSuspendReason("");
    }
  };

  // 🔄 Change role
  const handleChangeRole = async (user: User, newRole: string) => {
    setActionLoading(`role-${user.id}`);
    try {
      const res = await changeUserRole(user.id, newRole as any);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, role: newRole as any } : u,
          ),
        );
        toast.success("User role updated successfully.");
      } else {
        router.refresh();
        toast.error(res.message || "Failed to change user role.");
      }
    } catch (error) {
      console.error("Role change failed:", error);
      router.refresh();
      toast.error("An error occurred. Please try again.");
    } finally {
      setActionLoading(null);
      setRoleDialog({ open: false, user: null });
      setSelectedRole("");
    }
  };

  const handleToggleStatus = (user: User) => {
    setSuspendDialog({ open: true, user });
    setSuspendReason("");
  };

  const TableSkeleton = () => (
    <TableBody>
      {Array.from({ length: pageSize }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell className="text-right">
            <div className="flex items-center justify-end gap-2">
              <Skeleton className="size-8 rounded" />
              <Skeleton className="size-8 rounded" />
              <Skeleton className="size-8 rounded" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Users</h2>
          {loading ? (
            <Skeleton className="h-6 w-16 rounded-full" />
          ) : (
            <Badge variant="outline" className="ml-2">
              {total} total
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-lg border bg-muted/30 p-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <Select
            value={roleFilter || "all"}
            onValueChange={(val) =>
              updateParams({
                page: 1,
                search: searchValue,
                role: val === "all" ? "" : val,
              })
            }
            disabled={loading}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="PILOTOWNER">Pilot Owner</SelectItem>
              <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          {loading ? (
            <TableSkeleton />
          ) : (
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="font-medium">
                      {user.name ?? (
                        <span className="italic text-muted-foreground">
                          No name
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {user.email ?? (
                        <span className="italic text-muted-foreground">
                          No email
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getRoleVariant(user.role)}
                        className="font-medium"
                      >
                        {user.role
                          .replace("PILOTOWNER", "Pilot Owner")
                          .replace("SUPERADMIN", "Super Admin")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge
                          variant="outline"
                          className="border-green-200 bg-green-50 text-green-700"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-red-200 bg-red-50 text-red-700"
                        >
                          Suspended
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewUser(user.id)}
                          className="size-8 p-0"
                        >
                          <Eye className="size-4" />
                          <span className="sr-only">View user</span>
                        </Button> */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user.id)}
                          className="size-8 p-0"
                        >
                          <Edit className="size-4" />
                          <span className="sr-only">Edit user</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0"
                            >
                              <MoreHorizontal className="size-4" />
                              <span className="sr-only">More actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem
                              onClick={() => {
                                setRoleDialog({ open: true, user });
                                setSelectedRole(user.role);
                              }}
                            >
                              <Shield className="mr-2 size-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(user)}
                            >
                              <UserX className="mr-2 size-4" />
                              {user.isActive ? "Suspend User" : "Activate User"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                setDeleteDialog({ open: true, user })
                              }
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="size-8 text-muted-foreground/50" />
                      <p className="font-medium text-muted-foreground">
                        No users found
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {search || roleFilter
                          ? "Try adjusting your search or filters"
                          : "Users will appear here once added"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {loading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <span>•</span>
              <Skeleton className="h-4 w-24" />
            </div>
          ) : (
            <>
              <span>
                Showing {data.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(page * pageSize, total)} of {total} users
              </span>
              <span>•</span>
              <span>
                Page {page} of {totalPages}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() =>
              updateParams({
                page: page - 1,
                search: searchValue,
                role: roleFilter,
              })
            }
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() =>
              updateParams({
                page: page + 1,
                search: searchValue,
                role: roleFilter,
              })
            }
          >
            Next
          </Button>
        </div>
      </div>

      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, user: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-500" />
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {deleteDialog.user?.name || deleteDialog.user?.email}
              </strong>
              ? This action cannot be undone and will permanently remove all
              user data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label
              htmlFor="delete-password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Confirm your password <span className="text-red-500">*</span>
            </label>
            <Input
              id="delete-password"
              type="password"
              placeholder="Enter your password to confirm deletion"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="mt-2"
              disabled={actionLoading === `delete-${deleteDialog.user?.id}`}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Password confirmation is required for this destructive action.
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={actionLoading === `delete-${deleteDialog.user?.id}`}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialog.user && handleDeleteUser(deleteDialog.user)
              }
              className="bg-red-600 hover:bg-red-700"
              disabled={
                actionLoading === `delete-${deleteDialog.user?.id}` ||
                !deletePassword.trim()
              }
            >
              {actionLoading === `delete-${deleteDialog.user?.id}`
                ? "Deleting..."
                : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={suspendDialog.open}
        onOpenChange={(open) => setSuspendDialog({ open, user: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserX className="size-5 text-orange-500" />
              {suspendDialog.user?.isActive ? "Suspend User" : "Activate User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {suspendDialog.user?.isActive ? "suspend" : "activate"}{" "}
              <strong>
                {suspendDialog.user?.name || suspendDialog.user?.email}
              </strong>
              ?
              {suspendDialog.user?.isActive
                ? " This will prevent them from accessing the system."
                : " This will restore their access to the system."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {suspendDialog.user?.isActive && (
            <div className="py-4">
              <label
                htmlFor="suspend-reason"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Reason for suspension <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="suspend-reason"
                placeholder="Please provide a reason for suspending this user..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="mt-2 min-h-[80px]"
                disabled={actionLoading === `suspend-${suspendDialog.user?.id}`}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                This reason will be logged for audit purposes.
              </p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={actionLoading === `suspend-${suspendDialog.user?.id}`}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                suspendDialog.user && handleSuspendUser(suspendDialog.user)
              }
              disabled={
                actionLoading === `suspend-${suspendDialog.user?.id}` ||
                (suspendDialog.user?.isActive && !suspendReason.trim())
              }
            >
              {actionLoading === `suspend-${suspendDialog.user?.id}`
                ? suspendDialog.user?.isActive
                  ? "Suspending..."
                  : "Activating..."
                : suspendDialog.user?.isActive
                  ? "Suspend User"
                  : "Activate User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={roleDialog.open}
        onOpenChange={(open) => setRoleDialog({ open, user: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="size-5 text-blue-500" />
              Change User Role
            </DialogTitle>
            <DialogDescription>
              Change the role for{" "}
              <strong>{roleDialog.user?.name || roleDialog.user?.email}</strong>
              . This will affect their permissions and access level.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="PILOTOWNER">Pilot Owner</SelectItem>
                <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleDialog({ open: false, user: null })}
              disabled={actionLoading === `role-${roleDialog.user?.id}`}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                roleDialog.user &&
                handleChangeRole(roleDialog.user, selectedRole)
              }
              disabled={
                !selectedRole ||
                selectedRole === roleDialog.user?.role ||
                actionLoading === `role-${roleDialog.user?.id}`
              }
            >
              {actionLoading === `role-${roleDialog.user?.id}`
                ? "Updating..."
                : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
