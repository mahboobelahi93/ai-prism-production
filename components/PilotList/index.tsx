"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DownloadCloud,
  Eye,
  Loader2,
  Pen,
  Plus,
  Search,
  UploadCloud,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { PilotWithPreview } from "@/types/pilots";
import { categoryOptions } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function PilotList({
  pilots,
}: Readonly<{ pilots: PilotWithPreview[] }>) {
  const [searchInput, setSearchInput] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedPilot, setSelectedPilot] = useState<PilotWithPreview | null>(
    null,
  );
  const [optimisticPilots, setOptimisticPilots] = useState(pilots);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const debouncedSearch = useDebounce(searchInput, 300);

  // Update optimistic state when props change
  useEffect(() => {
    setOptimisticPilots(pilots);
  }, [pilots]);

  const filteredPilots = useMemo(
    () =>
      optimisticPilots.filter(
        (pilot) =>
          (categoryFilter === "All" || pilot.category === categoryFilter) &&
          pilot.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [optimisticPilots, categoryFilter, debouncedSearch],
  );

  const handleAddNew = () => {
    router.push("/portal/pilots/new");
  };

  const confirmTogglePublish = async () => {
    if (!selectedPilot || isPublishing) return;

    const previousState = [...optimisticPilots];
    const newPublishState = !selectedPilot.isPublished;

    // Optimistic update
    setOptimisticPilots((prev) =>
      prev.map((p) =>
        p.id === selectedPilot.id ? { ...p, isPublished: newPublishState } : p,
      ),
    );
    setConfirmationOpen(false);
    setIsPublishing(true);

    try {
      const response = await fetch("/api/pilots/updatePublishStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pilotId: selectedPilot.id,
          isPublished: newPublishState,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to update: ${response.statusText}`,
        );
      }

      toast.success(
        `Pilot ${newPublishState ? "published" : "unpublished"} successfully`,
      );

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      // Rollback optimistic update
      setOptimisticPilots(previousState);

      console.error("Publish toggle error:", error);
      toast.error("Failed to update pilot", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col space-y-4">
        <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <Button onClick={handleAddNew} className="w-full sm:w-auto">
            <Plus className="mr-2 size-4" />
            Add Pilot
          </Button>
          <div className="flex w-full flex-col space-y-4 sm:w-auto sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="relative grow">
              <Input
                type="text"
                placeholder="Search pilots..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            </div>
            <Select onValueChange={setCategoryFilter} defaultValue="All">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categoryOptions.map((item) => (
                  <SelectItem value={item.value} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredPilots.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-4">
            <ImageIcon className="size-8 text-slate-400" />
          </div>
          <p className="text-lg font-medium text-slate-700">No pilots found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPilots.map((pilot) => (
            <Card
              key={pilot.id}
              className="group flex flex-col overflow-hidden border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                {pilot?.thumbnailFile?.preview ? (
                  <Image
                    priority
                    src={pilot.thumbnailFile.preview || "/placeholder.svg"}
                    alt={pilot.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                    <ImageIcon className="size-10" />
                    <span className="text-sm font-medium">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <CardContent className="grow p-5">
                <h2 className="mb-3 line-clamp-2 text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-600">
                  {pilot.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    {pilot.category}
                  </Badge>
                  <Badge
                    variant={pilot.isPublished ? "default" : "destructive"}
                    className={
                      pilot.isPublished
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                    }
                  >
                    {pilot.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardContent>

              <CardFooter className="p-0">
                <div className="grid w-full grid-cols-4 divide-x divide-slate-200 border-t border-slate-200">
                  <Link
                    href={`/portal/pilots/edit/${pilot.id}`}
                    className="group/btn flex items-center justify-center p-4 transition-all hover:bg-blue-50"
                    aria-label={`Edit ${pilot.title}`}
                  >
                    <Pen className="size-5 text-slate-600 transition-colors group-hover/btn:text-blue-600" />
                    <span className="sr-only">Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPilot(pilot);
                      setConfirmationOpen(true);
                    }}
                    className="group/btn flex items-center justify-center p-4 transition-all hover:bg-emerald-50 disabled:opacity-50 disabled:hover:bg-transparent"
                    disabled={isPublishing}
                    aria-label={`${pilot.isPublished ? "Unpublish" : "Publish"} ${pilot.title}`}
                  >
                    {isPublishing && selectedPilot?.id === pilot.id ? (
                      <Loader2 className="size-5 animate-spin text-slate-600" />
                    ) : pilot.isPublished ? (
                      <DownloadCloud className="size-5 text-slate-600 transition-colors group-hover/btn:text-emerald-600" />
                    ) : (
                      <UploadCloud className="size-5 text-slate-600 transition-colors group-hover/btn:text-emerald-600" />
                    )}
                    <span className="sr-only">
                      {pilot.isPublished ? "Unpublish" : "Publish"}
                    </span>
                  </button>

                  <Link
                    href={`/portal/pilots/details/${pilot.id}`}
                    className="group/btn flex items-center justify-center p-4 transition-all hover:bg-purple-50"
                    aria-label={`View details of ${pilot.title}`}
                  >
                    <Eye className="size-5 text-slate-600 transition-colors group-hover/btn:text-purple-600" />
                    <span className="sr-only">View</span>
                  </Link>

                  <Link
                    href={`/portal/pilots/users/${pilot.id}`}
                    className="group/btn flex items-center justify-center p-4 transition-all hover:bg-indigo-50"
                    aria-label={`View users for ${pilot.title}`}
                  >
                    <User className="size-5 text-slate-600 transition-colors group-hover/btn:text-indigo-600" />
                    <span className="sr-only">Users</span>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              <b>{selectedPilot?.isPublished ? "unpublish" : "publish"}</b> the
              pilot &apos;{selectedPilot?.title}&apos;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPublishing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmTogglePublish}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
