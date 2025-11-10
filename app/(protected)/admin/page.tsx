import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnrollmentList } from "@/components/dashboard/enrollment-list";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import PendingRequests from "@/components/dashboard/pending-requests";

// import PilotSummary from "@/components/dashboard/pilot-summary";

export const metadata = constructMetadata({
  title: "PILOTOWNER – Next Template",
  description: "PILOTOWNER page for only admin management.",
});

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <>
      <DashboardHeader
      // heading="Loading..."
      // text="Access only for users with Pilot Owner role."
      />
      <div className="flex flex-col gap-6">
        {/* Stats/Info Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard />
        </div>
        <PendingRequests />
      </div>
    </>
  );
}
