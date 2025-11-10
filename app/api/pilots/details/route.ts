import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const revalidate = 0;
export async function GET(
  request: Request,
  { params }: { params: { pilotId: string } },
) {
  const pilotId = params.pilotId;

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pilot = await prisma.pilot.findUnique({
      where: { id: pilotId },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        thumbnailFile: {
          select: {
            url: true,
          },
        },
        subscriptions: {
          where: {
            userId: currentUser.id,
          },
        },
      },
    });

    if (!pilot) {
      return NextResponse.json({ error: "Pilot not found" }, { status: 404 });
    }

    const pilotDetails = {
      id: pilot.id,
      title: pilot.title,
      description: pilot.description,
      thumbnailFile: {
        preview:
          pilot.thumbnailFile?.url || "/placeholder.svg?height=400&width=600",
      },
      category: pilot.category,
      duration: pilot.duration,
      participants: pilot.participants,
      isSubscribed: pilot.subscriptions.length > 0,
      isApproved: pilot.subscriptions[0]?.status === "APPROVED" || false,
      owner: {
        name: pilot.owner.name,
        email: pilot.owner.email,
        avatar: pilot.owner.image || "/placeholder.svg?height=96&width=96",
      },
    };

    return NextResponse.json(pilotDetails);
  } catch (error) {
    console.error("Error fetching pilot details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
