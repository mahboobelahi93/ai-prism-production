import { redirect } from "next/navigation";
import { fetchPilots } from "@/actions/pilots";
import { IBreadcrumbItem } from "@/types";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import PilotList from "@/components/PilotList";
import { CustomBreadcrumb } from "@/components/shared/custom-breadcrumb";

import EmptyCard from "./_components/empty-card";

export const metadata = constructMetadata({
  title: "Pilots – AI-PRISM",
  description: "Check and manage your pilots.",
});

export default async function PilotsPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  const breadcrumbItems: IBreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Pilots" },
  ];
  const pilots = await fetchPilots();

  return (
    <>
      <CustomBreadcrumb items={breadcrumbItems} />
      <DashboardHeader heading="Pilots" text="Check and manage your Pilots." />
      {pilots?.data?.length > 0 ? (
        <PilotList pilots={pilots?.data} />
      ) : (
        <EmptyCard />
      )}
    </>
  );
}
