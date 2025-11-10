import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await getCurrentUser();
  console.log("user", user);

  if (user) {
    if (user.role === "PILOTOWNER") {
      redirect("/admin");
      return null; // Ensures no further code is executed
    }
    redirect("/dashboard");
    return null; // Prevents further rendering
  }

  return <div className="min-h-screen">{children}</div>;
}
