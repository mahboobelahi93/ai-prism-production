"use client";

import type React from "react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { redirect, useRouter } from "next/navigation";
import { updateUser } from "@/actions/users";
import { toast } from "sonner";

type User = {
  clerkId: string;
  createdAt: Date;
  email: string;
  id: string;
  image: string;
  isActive: boolean;
  name: string;
  role: "USER" | "SUPERADMIN" | "PILOTOWNER";
  storageLimit: bigint;
  storageUsed: bigint;
  suspendedAt: Date | null;
  suspendedById: string | null;
  suspensionReason: string | null;
  updatedAt: Date;
};

interface UserEditFormProps {
  user: User;
}

export function UserEditForm({ user }: UserEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    isActive: user.isActive,
    storageLimit: Number(user.storageLimit) / (1024 * 1024 * 1024), // Convert to GB
    suspensionReason: user.suspensionReason || "",
  });

  const [isSuspended, setIsSuspended] = useState(!!user.suspendedAt);
  const isSuperAdmin = user.role === "SUPERADMIN";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Convert storageLimit back to BigInt in bytes
    const storageLimitInBytes = Math.floor(formData.storageLimit * 1024 * 1024 * 1024);

    // Prepare the data to be sent to the API
    const updateData = {
      ...formData,
      storageLimit: storageLimitInBytes.toString(),
      isSuspended: isSuspended,
    };

    // Call the updateUser action
    const res = await updateUser(user.id, updateData);
    if (res.success) {
      toast.success("User updated successfully.");
      router.refresh();
      router.replace('/dashboard'); // Redirect to user list or another appropriate page
    } else {
      router.refresh(); // fallback refetch
      toast.error(res.message || "Failed to update user.");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const formatBytes = (bytes: bigint) => {
    const gb = Number(bytes) / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  const storagePercentage = Number(
    (user.storageUsed * BigInt(100)) / user.storageLimit,
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Basic user account details and identification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="id" className="text-sm font-medium">
                User ID
              </Label>
              <Input
                id="id"
                value={user.id}
                disabled
                className="bg-muted font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clerkId" className="text-sm font-medium">
                Clerk ID
              </Label>
              <Input
                id="clerkId"
                value={user.clerkId}
                disabled
                className="bg-muted font-mono text-sm"
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter full name"
                disabled={isSuperAdmin}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="user@example.com"
                disabled
              />
            </div>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium">
              Profile Image URL
            </Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="https://example.com/avatar.jpg"
            />
          </div> */}

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Created At</Label>
              <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
                {formatDate(user.createdAt)}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Last Updated</Label>
              <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
                {formatDate(user.updatedAt)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions & Role */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions & Role</CardTitle>
          <CardDescription>
            Manage user access level and account status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                User Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as User["role"] })
                }
                disabled={isSuperAdmin}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="PILOTOWNER">Pilot Owner</SelectItem>
                  <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="isActive" className="text-sm font-medium">
                Account Status
              </Label>
              <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                  disabled={isSuperAdmin}
                />
                <span className="text-sm">
                  {formData.isActive ? (
                    <Badge variant="default" className="bg-green-600">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Management */}
      {!isSuperAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Storage Management</CardTitle>
            <CardDescription>
              Monitor and configure storage allocation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <Label className="font-medium">Storage Usage</Label>
                <span className="text-muted-foreground">
                  {formatBytes(user.storageUsed)} /{" "}
                  {formatBytes(user.storageLimit)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {storagePercentage.toFixed(1)}% of storage limit used
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="storageLimit" className="text-sm font-medium">
                Storage Limit (GB)
              </Label>
              <Input
                id="storageLimit"
                type="number"
                step="0.5"
                min="0.05"
                value={formData.storageLimit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storageLimit: Number(e.target.value),
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Current limit: {formatBytes(user.storageLimit)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Account Suspension */}
      <Card>
        <CardHeader>
          <CardTitle>Account Suspension</CardTitle>
          <CardDescription>Temporarily suspend user access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="suspended" className="text-sm font-medium">
                Suspend Account
              </Label>
              <p className="text-xs text-muted-foreground">
                Temporarily disable user access to the platform
              </p>
            </div>
            <Switch
              id="suspended"
              checked={isSuspended}
              onCheckedChange={setIsSuspended}
              disabled={isSuperAdmin}
            />
          </div>

          {isSuspended && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label
                  htmlFor="suspensionReason"
                  className="text-sm font-medium"
                >
                  Suspension Reason
                </Label>
                <Textarea
                  id="suspensionReason"
                  value={formData.suspensionReason}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      suspensionReason: e.target.value,
                    })
                  }
                  placeholder="Enter reason for suspension..."
                  rows={3}
                />
              </div>

              {user.suspendedAt && (
                <div className="rounded-md border border-border bg-muted p-3">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Suspended on:</span>{" "}
                    {formatDate(user.suspendedAt)}
                  </p>
                  {user.suspendedById && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      <span className="font-medium">Suspended by:</span>{" "}
                      {user.suspendedById}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => { router.replace('/dashboard') }}>
          Cancel
        </Button>
        {!isSuperAdmin && (
          <Button type="submit">Save Changes</Button>
        )}
      </div>
    </form>
  );
}
