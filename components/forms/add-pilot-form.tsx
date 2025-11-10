"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrUpdatePilot, deletePilot } from "@/actions/pilots";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pilot } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { categoryOptions } from "@/config/site";
import { pilotFormSchema } from "@/lib/validations/pilots";
import PilotsLoading from "@/app/(protected)/portal/pilots/loading";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form } from "../ui/form";
import FormFileUploader from "./form-file-uploader";
import FormInput from "./form-input";
import FormRichTextInput from "./form-rich-text-input";
import FormSelect from "./form-select";

import "suneditor/dist/css/suneditor.min.css";

import { CONSTANTS } from "@/lib/constants";
import { useUploadFile } from "@/hooks/use-upload-file";
import { DeletePilotDialog } from "@/components/modals/deletepilotdialog";

export default function AddPilotForm({
  pilotDetails,
}: {
  pilotDetails?: Pilot | null;
}) {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const { uploadFileToS3Direct, UploadFileContextProvider } = useUploadFile();

  if (!isLoaded) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex justify-center p-8">
        <Card>
          <CardContent className="p-6">Please sign in again.</CardContent>
        </Card>
      </div>
    );
  }

  const form = useForm({
    resolver: zodResolver(pilotFormSchema),
    defaultValues: {
      title: pilotDetails?.title ?? "",
      category: pilotDetails?.category ?? "",
      description: pilotDetails?.description ?? "",
      thumbnail: pilotDetails?.thumbnailFile
        ? [pilotDetails?.thumbnailFile]
        : null,
      thumbnailFileId: pilotDetails?.thumbnailFileId ?? null,
      isPublished: pilotDetails?.isPublished ?? false,
    },
  });
  function onSubmit(submitData: z.infer<typeof pilotFormSchema>) {
    if (user) {
      startTransition(async () => {
        try {
          const thumbnailFormData = new FormData();
          if (submitData.thumbnail[0] instanceof File) {
            if (submitData.thumbnail[0].size > 1.9 * 1024 * 1024) {
              toast.error("Thumbnail size should be less than 2MB");
              return;
            }
            const uploadedResult = await uploadFileToS3Direct(
              submitData.thumbnail[0],
              CONSTANTS.FILE_CLASS_TYPE.PILOT_THUMBNAIL,
            );
            console.log("uploadedResult : ", uploadedResult);
            thumbnailFormData.append("thumbnail", uploadedResult);
          }
          submitData["thumbnailFileId"] = pilotDetails?.thumbnailFileId ?? null;

          // Use the server action to handle the submission
          const result = await createOrUpdatePilot(
            JSON.stringify(submitData),
            pilotDetails?.id,
            thumbnailFormData,
          );

          if (result.error) {
            toast.error(result.error);
            return;
          }

          if (!pilotDetails?.id && result.data?.id) {
            toast.success("Pilot created successfully");
            router.push(`/portal/pilots/edit/${result.data.id}?tab=lessons`);
            return;
          }
          toast.success("Pilot updated successfully");
        } catch (error) {
          toast.error("Something went wrong with the upload.");
        }
      });
    }
  }

  const handleDelete = async () => {
    if (!pilotDetails) return;

    setIsDeleting(true);
    try {
      const response = await deletePilot(pilotDetails.id);

      if (response.success) {
        router.push("/portal/pilots");
        toast.success(response.message);
      } else {
        toast.error(response.message || "Failed to delete pilot");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the pilot");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isPending) {
    return <PilotsLoading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilot Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <UploadFileContextProvider>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormInput
                inputName={"title"}
                labelName={"Pilot Name"}
                placeholder="e.g Prodigi Cell"
                maxLength={100}
              />
              <FormFileUploader
                inputName="thumbnail"
                labelName="Add Thumbnail"
                description={"Supports JPG and PNG up to 2MB"}
                accept={{
                  "image/jpeg": [".jpeg", ".png"],
                }}
              />
              <FormSelect
                inputName="category"
                labelName="Category"
                options={categoryOptions}
                placeholder="Select a category"
              />
              <FormRichTextInput
                inputName="description"
                labelName="Description"
              />
              {/* <FormCheckbox
                            inputName="isPublished"
                            labelName="Publish"
                        /> */}
              <div className="flex justify-between">
                {pilotDetails && (
                  <DeletePilotDialog
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                  />
                )}
                <div className="mt-2 flex justify-end gap-2">
                  <Button type="submit" className="w-auto">
                    Submit
                  </Button>
                  <Button
                    className="p-button-secondary w-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/portal/pilots");
                    }}
                    variant={"destructive"}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </UploadFileContextProvider>
        </Form>
      </CardContent>
    </Card>
  );
}
