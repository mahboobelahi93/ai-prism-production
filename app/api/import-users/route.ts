// app/api/import-users/route.ts
import { NextResponse } from "next/server";
import { Clerk } from "@clerk/clerk-sdk-node";
import { parse } from "csv-parse/sync";

import { prisma } from "@/lib/db";

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const records: any = parse(buffer.toString(), {
      columns: true,
      skip_empty_lines: true,
    });

    const results: any = [];
    let successCount = 0;
    let errorCount = 0;

    for (const record of records) {
      try {
        let clerkUser;
        let password = record.password || generateRandomPassword();

        // Check if user exists in Clerk
        const existingUsers = await clerk.users.getUserList({
          emailAddress: [record.email],
        });

        if (existingUsers.length > 0) {
          // User exists in Clerk - update if needed
          clerkUser = existingUsers[0];
          results.push({
            email: record.email,
            status: "skipped (exists in Clerk)",
            clerkId: clerkUser.id,
          });
        } else {
          // Create new user in Clerk
          clerkUser = await clerk.users.createUser({
            emailAddress: [record.email],
            firstName: record.firstName,
            lastName: record.lastName,
            password: password,
          });
        }

        // Check if user exists in your database
        const existingDbUser = await prisma.user.findUnique({
          where: { email: record.email },
        });

        if (existingDbUser) {
          // Update existing user in your database
          await prisma.user.update({
            where: { email: record.email },
            data: {
              clerkId: clerkUser.id,
              name: `${record.firstName} ${record.lastName}`,
              image: record.image,
              storageLimit: parseInt(record.storageLimit) || 0,
              storageUsed: parseInt(record.storageUsed) || 0,
              updatedAt: new Date(),
            },
          });
          results.push({
            email: record.email,
            status: "updated in DB",
            clerkId: clerkUser.id,
            password,
          });
        } else {
          // Create new user in your database
          await prisma.user.create({
            data: {
              clerkId: clerkUser.id,
              email: record.email,
              name: `${record.firstName} ${record.lastName}`,
              image: record.image,
              createdAt: new Date(),
              updatedAt: new Date(),
              storageLimit: parseInt(record.storageLimit) || 0,
              storageUsed: parseInt(record.storageUsed) || 0,
            },
          });
          results.push({
            email: record.email,
            status: "created",
            clerkId: clerkUser.id,
            password: password, // Only include for new users
          });
        }

        successCount++;
      } catch (error: any) {
        errorCount++;
        results.push({
          email: record.email,
          status: "error",
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      message: "Import completed",
      total: records.length,
      successCount,
      errorCount,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}

function generateRandomPassword(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
