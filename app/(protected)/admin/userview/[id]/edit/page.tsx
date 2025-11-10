import { getUserById } from "@/actions/users";

import { UserEditForm } from "@/components/users/user-edit-form";

// Sample user data - in a real app, this would come from an API or database
// const sampleUser = {
//   clerkId: "user_31S8gKxQAtXC6hAiIh1TG6trB3q",
//   createdAt: new Date("2025-09-26T09:44:52.000Z"),
//   email: "sharath.akkaladevi@profactor.at",
//   id: "cmg0nob850000l2zazndx9p2b",
//   image: "",
//   isActive: true,
//   name: "undefined undefined",
//   role: "USER" as const,
//   storageLimit: BigInt(1073741824),
//   storageUsed: BigInt(0),
//   suspendedAt: null,
//   suspendedById: null,
//   suspensionReason: null,
//   updatedAt: new Date("2025-09-26T09:45:48.000Z"),
// };

export default async function Page({ params }: { params: { id: string } }) {
  const sampleUser = await getUserById(params.id);
  if (!sampleUser) {
    return <div>User not found</div>;
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground">
            User Settings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage user account information and permissions
          </p>
        </div>
        <UserEditForm user={sampleUser} />
      </div>
    </div>
  );
}
