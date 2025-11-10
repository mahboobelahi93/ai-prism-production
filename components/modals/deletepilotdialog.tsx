"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeletePilotDialogProps {
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

export function DeletePilotDialog({
  onDelete,
  isDeleting,
}: DeletePilotDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setDeleteConfirmText("");
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (deleteConfirmText.toLowerCase() !== "delete") return;
    await onDelete();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 size-4" />
          Delete Pilot
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Pilot?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the pilot
            and all associated lessons, videos, and notes.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <Label htmlFor="delete-confirm" className="text-sm font-medium">
            Type DELETE to confirm
          </Label>
          <Input
            id="delete-confirm"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Type DELETE"
          />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={
              deleteConfirmText.toLowerCase() !== "delete" || isDeleting
            }
          >
            {isDeleting ? "Deleting..." : "Delete Pilot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
