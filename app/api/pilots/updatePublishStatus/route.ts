import { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { pilotId, isPublished } = await req.json(); // Parse the JSON body

  if (!pilotId) {
    return new Response(JSON.stringify({ error: "Pilot ID is required" }), {
      status: 400,
    });
  }

  try {
    // Update the published status in the database
    const updatedPilot = await prisma.pilot.update({
      where: { id: pilotId },
      data: { isPublished },
    });

    return new Response(
      JSON.stringify({ success: true, pilot: updatedPilot }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update publish status:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update publish status" }),
      { status: 500 },
    );
  }
}
