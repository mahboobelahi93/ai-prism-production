import React from "react";
import { DropzoneProps } from "react-dropzone/.";
import { useFormContext } from "react-hook-form";

import { FileUploader } from "../file-uploader";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface IProps {
  inputName: string;
  labelName?: string;
  description?: string;
  accept?: DropzoneProps["accept"];
  maxFileCount: number;
  maxSize: number; // in MB
}
export default function FormFileUploader({
  inputName,
  labelName,
  description,
  maxFileCount = 1,
  maxSize = 2,
  accept = { "image/*": [] },
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={inputName}
      render={({ field }) => (
        <div className="space-y-6">
          <FormItem className="w-full">
            <FormLabel>{labelName}</FormLabel>
            <FormControl>
              <FileUploader
                value={field.value}
                onValueChange={(files) => {
                  field.onChange(files.length > 0 ? files : null);
                }}
                maxFileCount={maxFileCount}
                maxSize={maxSize * 1024 * 1024}
                accept={accept}
              // progresses={progresses}
              // pass the onUpload function here for direct upload
              // onUpload={uploadedFiles}
              // disabled={isUploading}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
          {/* {uploadedFiles.length > 0 ? (
                        <UploadedFilesCard uploadedFiles={uploadedFiles} />
                    ) : null} */}
        </div>
      )}
    />
  );
}
