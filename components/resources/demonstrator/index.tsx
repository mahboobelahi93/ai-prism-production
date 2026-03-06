"use client";

import { useState } from "react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { FileViewerModal } from "@/components/shared/file-viewer-modal";
import { Icons } from "@/components/shared/icons";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
}

const videos: Video[] = [
  {
    id: "1",
    title: "Prodigi Cell",
    thumbnail:
      "https://aiprism-prod-bucket.s3.eu-north-1.amazonaws.com/demonstrators/thumbnail/photo_1_2025-02-26_14-15-23.jpg",
    videoUrl:
      "https://aiprism-prod-bucket.s3.eu-north-1.amazonaws.com/demonstrators/2024-07-18+14-05-44.mp4",
  },
  {
    id: "2",
    title: "Vigo Pilot",
    thumbnail:
      "https://aiprism-prod-bucket.s3.eu-north-1.amazonaws.com/demonstrators/thumbnail/vigo.png",
    videoUrl:
      "https://aiprism-prod-bucket.s3.eu-north-1.amazonaws.com/demonstrators/Vigo.mp4",
  },
  {
    id: "3",
    title: "Silverline Use Case",
    thumbnail:
      "https://aiprism-prod-bucket.s3.eu-north-1.amazonaws.com/demonstrators/thumbnail/silverline-usecase.png",
    videoUrl:
      "https://aiprism-prod-bucket.s3.eu-north-1.amazonaws.com/demonstrators/Silverline+Use+Case.mp4",
  },
];

export default function DemonstratorContent() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Demonstrators</h1>

      {selectedVideo && (
        // <div className="mb-8">
        //   <h2 className="mb-4 text-2xl font-semibold">{selectedVideo.title}</h2>
        //   <div className="mb-4 aspect-video">
        //     <video
        //       src={selectedVideo.videoUrl}
        //       controls
        //       className="h-full w-full"
        //       autoPlay
        //     >
        //       Your browser does not support the video tag.
        //     </video>
        //   </div>
        // </div>
        <FileViewerModal
          url={selectedVideo.videoUrl}
          filename={selectedVideo.title}
          open={openModal}
          fileType={"video/mp4"}
          onOpenChange={setOpenModal}
        />
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {videos.map((video) => (
          <Card
            key={video.id}
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => {
              setSelectedVideo(video);
              setOpenModal(true);
            }}
          >
            <CardContent className="relative p-0">
              <Image
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                width={320}
                height={180}
                className="h-auto w-full"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity hover:opacity-100">
                <Icons.playCircle className="h-12 w-12 text-white" />
              </div>
            </CardContent>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">{video.title}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
