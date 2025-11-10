import { Prisma } from "@prisma/client";

type PilotWithPreview = Prisma.PilotGetPayload<{
  include: { thumbnailFile: true };
}> & {
  thumbnailFile?: {
    key: string;
    preview?: string;
  };
};
