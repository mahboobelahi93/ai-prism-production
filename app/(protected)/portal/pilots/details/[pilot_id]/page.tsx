
import { getPilotDetailsById } from "@/actions/pilots";
import { IBreadcrumbItem } from "@/types";

import { DashboardHeader } from "@/components/dashboard/header";
import { CustomBreadcrumb } from "@/components/shared/custom-breadcrumb";
import PilotDetails from "../_components/pilot-details";

export default async function Component({
  params,
}: {
  params: { pilot_id: string };
}) {
  const breadcrumbItems: IBreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Pilots", href: "/portal/pilots" },
    { label: "Details" }, // The last item doesn't need an href
  ];
  const pilotDetails = await getPilotDetailsById(params.pilot_id);

  return (
    <>
      <CustomBreadcrumb items={breadcrumbItems} />
      <DashboardHeader heading="Pilot Details" text="" />
      <PilotDetails pilotDetails={pilotDetails?.data} />
    </>
  );
}
