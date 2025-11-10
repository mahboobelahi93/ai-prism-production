import { getSubscriptionCounts } from "@/actions/enrollments";
import { fetchPilots, getAllPilots } from "@/actions/pilots";
import { Clock, Flag, Users } from "lucide-react";

import { getCurrentUser } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function InfoCard() {
  const pilotsData = await fetchPilots();
  const totalPilotsOfOwner = pilotsData?.data.length;

  const { approvedCount, pendingCount } = await getSubscriptionCounts();

  return (
    <>
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Approved Subscriber
          </CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvedCount}</div>
          <p className="text-xs text-muted-foreground">
            Total approved subscriptions
          </p>
        </CardContent>
      </Card>

      <Card
        className={`border-l-4 ${pendingCount > 0 ? "border-l-yellow-500" : "border-l-muted"}`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Request Pending</CardTitle>
          <Clock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${pendingCount > 0 ? "text-yellow-600" : ""}`}
          >
            {pendingCount}
          </div>
          <p className="text-xs text-muted-foreground">
            Total pending subscriptions
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pilots</CardTitle>
          <Flag className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPilotsOfOwner}</div>
          <p className="text-xs text-muted-foreground">
            Total Pilots under your account
          </p>
        </CardContent>
      </Card>
    </>
  );
}
