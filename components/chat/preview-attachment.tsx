import { Attachment } from "ai";

import { LoaderIcon } from "./icons";
import { FileViewerModal } from "../shared/file-viewer-modal";
import { useState } from "react";
import { FileTextIcon } from "lucide-react";
import Image from "next/image";

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
}: {
  attachment: Attachment;
  isUploading?: boolean;
}) => {
  const { name, url, contentType } = attachment;
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="flex w-80 flex-col gap-2">
      <div className="relative flex h-12 w-full cursor-pointer flex-col justify-center rounded-md bg-muted"
        onClick={() => { setOpenModal(true); }}
      >
        {contentType ? (
          contentType.startsWith("image") ? (
            // NOTE: it is recommended to use next/image for images
            // eslint-disable-next-line @next/next/no-img-element
            <div className="flex items-center gap-2">
              <Image
                src={url}
                alt={name ?? "An image attachment"}
                width={48}
                height={48}
                loading="lazy"
                className="aspect-square shrink-0 rounded-md object-cover"
              />
              <p className="line-clamp-1 text-sm font-medium text-foreground/80">
                {name}
              </p>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-2">
              <div className="flex items-center gap-2">
                <FileTextIcon size={48} />
                <p className="line-clamp-1 text-sm font-medium text-foreground/80">
                  {name}
                </p>
              </div>
            </div>
          )
        ) : (
          <div className=""></div>
        )}

        {isUploading && (
          <div className="absolute animate-spin text-zinc-500">
            <LoaderIcon />
          </div>
        )}
      </div>
      <FileViewerModal
        url={url}
        filename={name ?? ''}
        open={openModal}
        fileType={contentType}
        onOpenChange={setOpenModal}
      />
    </div>
  );
};
