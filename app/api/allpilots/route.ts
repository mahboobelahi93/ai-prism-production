import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const pilots = await prisma.pilot.findMany({
      where: {
        isPublished: true, // Only fetch published pilots
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        thumbnailFile: true,
        ownerId: true,
      },
    });

    const pilotOwners = await Promise.all(
      pilots.map(async (pilot) => {
        const owner = await prisma.user.findUnique({
          where: { id: pilot.ownerId },
          select: { name: true, email: true },
        });
        return { ...pilot, owner };
      }),
    );

    return NextResponse.json(pilotOwners);
  } catch (error) {
    console.error("Failed to fetch pilots:", error);
    return NextResponse.json(
      { error: "Failed to fetch pilots" },
      { status: 500 },
    );
  }
}
