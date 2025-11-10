import { get } from "http";
import { processPilotOwnerRequest } from "@/actions/check-user";
import { auth } from "@clerk/nextjs/server";

import { getCurrentUser, getCurrentUserId } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return null;
  }
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEmail = user?.email;

  const request = await prisma.pilotOwnerRequests.findUnique({
    where: { id: params.id },
  });

  if (!request) {
    return Response.json({ error: "Request not found" }, { status: 404 });
  }

  const result = await processPilotOwnerRequest(
    btoa(
      JSON.stringify({
        email: request.email,
        name: request.name,
        organization: request.organization,
        timestamp: Date.now(),
      }),
    ),
    "reject",
    adminEmail,
  );

  if (result.success) {
    await prisma.pilotOwnerRequests.update({
      where: { id: params.id },
      data: {
        status: "REJECTED",
        processedAt: new Date(),
        processedBy: adminEmail,
      },
    });
  }

  return Response.json(result);
}
