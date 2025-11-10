import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export function FileViewerModal({
    filename,
    url,
    fileType,
    open,
    onOpenChange,
}: {
    url: string;
    fileType?: string;
    filename: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const extension = filename.split(".")?.pop()?.toLowerCase();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-5/6 h-auto w-full min-w-[80%] rounded-lg">
                <div className="flex h-full flex-col">
                    <DialogHeader className="mb-4 border-b py-4">
                        <DialogTitle> File Viewer: {filename}</DialogTitle>
                    </DialogHeader>

                    {extension === "pdf" ? (
                        <object className="h-[75vh] w-full" data={url} />
                    ) : fileType?.startsWith("image/") ? (
                        <div className="h-[60vh]">
                            <Image
                                src={url}
                                alt={filename}
                                loading="lazy"
                                width={100}
                                height={100}
                                unoptimized
                                className="aspect-square size-full shrink-0 rounded-md object-cover"
                            />
                        </div>
                    ) : fileType?.startsWith("video/") ? (
                        <video
                            className="h-[60vh] w-full rounded-md"
                            controls
                        // controlsList="nodownload" // Prevents downloading but allows fullscreen & volume control
                        >
                            <source src={url} type={fileType} />
                            Your browser does not support the video tag.
                        </video>
                    ) : extension?.includes("docx") ? (
                        <iframe
                            src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                                url
                            )}`}
                            style={{
                                width: "100%",
                                height: "75vh",
                                border: "none",
                            }}
                        ></iframe>
                    ) : (
                        <object className="h-[75vh] w-full" data={url} />
                    )}

                    <DialogFooter className="mt-4 border-t py-4">
                        <DialogClose asChild>
                            <Button type="button">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
