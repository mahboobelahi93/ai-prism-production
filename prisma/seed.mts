import { Clerk } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY! });

async function main() {
  const email = process.env.SUPERADMIN_EMAIL!;
  const password = process.env.SUPERADMIN_PASSWORD!;

  // 1. Ensure Superadmin exists in Clerk
  let clerkUser;
  try {
    const existing = await clerk.users.getUserList({ emailAddress: [email] });
    if (existing.length > 0) {
      clerkUser = existing[0];
    } else {
      clerkUser = await clerk.users.createUser({
        emailAddress: [email],
        password,
        firstName: "Super",
        lastName: "Admin",
      });
      console.log("✅ Created Superadmin in Clerk");
    }
  } catch (err) {
    console.error("❌ Clerk error:", err);
    process.exit(1);
  }

  // 2. Ensure Superadmin exists in Prisma (always active, no suspension)
  const superadmin = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      role: "SUPERADMIN",
      isActive: true,
      suspendedAt: null,
      suspendedById: null,
      suspensionReason: null,
    },
    create: {
      clerkId: clerkUser.id,
      email,
      name: "Super Admin",
      role: "SUPERADMIN",
      isActive: true,
      suspendedAt: null,
      suspendedById: null,
      suspensionReason: null,
    },
  });

  console.log("✅ Synced Superadmin:", {
    prismaId: superadmin.id,
    clerkId: clerkUser.id,
    email: superadmin.email,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
