import { redirect } from "next/navigation";
import { getAllPilots } from "@/actions/pilots";
import { IBreadcrumbItem } from "@/types";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import PilotList from "@/components/allpilots";
import { DashboardHeader } from "@/components/dashboard/header";
import { CustomBreadcrumb } from "@/components/shared/custom-breadcrumb";

export const metadata = constructMetadata({
  title: "Pilots – AI-PRISM",
  description: "Check and manage your pilots.",
});

export default async function PilotsPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const breadcrumbItems: IBreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Explore Available Pilots", href: "/dashboard" },
  ];
  const pilotsData = await getAllPilots();
  const { pilots, stats } = pilotsData.data;
  return (
    <>
      <CustomBreadcrumb items={breadcrumbItems} />
      <DashboardHeader heading="Pilots" text="Check and manage your Pilots." />
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div>Total Pilots: {stats.totalPilots}</div>
        <div>Enrolled: {stats.enrolledPilots}</div>
        <div>In Progress: {stats.inProgressPilots}</div>
      </div>
      <PilotList pilots={pilots} />
    </>
  );
}
