// app/api/check-user/route.ts
import { NextResponse } from "next/server";

import { prisma as db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("clerkId");

  if (!userId) {
    return NextResponse.json({ exists: false }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { isActive: true },
  });

  if (!user || user.isActive === false) {
    return NextResponse.json({
      exists: false,
      isActive: user?.isActive ?? false,
    });
  }

  return NextResponse.json({ exists: true, isActive: true });
}
