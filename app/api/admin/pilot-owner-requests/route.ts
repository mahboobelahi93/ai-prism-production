import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const requests = await prisma.pilotOwnerRequests.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Failed to fetch pilot owner requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 },
    );
  }
}
