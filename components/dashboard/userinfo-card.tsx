import { getSubscriptionCounts } from "@/actions/enrollments";
import { fetchPilots, getAllPilots } from "@/actions/pilots";
import { Clock, Flag, Users } from "lucide-react";

import { getCurrentUser } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function InfoCard() {
  const pilotsData = await getAllPilots();
  const { pilots, stats } = pilotsData.data;
  const enrolledPilots = pilots.filter((pilot) => pilot.isEnrolled);

  return (
    <>
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pilots</CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPilots}</div>
          <p className="text-xs text-muted-foreground">
            Total Pilots in AI-PRISM
          </p>
        </CardContent>
      </Card>

      <Card
        className={`border-l-4 ${stats.totalPilots > 0 ? "border-l-yellow-500" : "border-l-muted"}`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Subscribed Pilots
          </CardTitle>
          <Clock className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${stats.totalPilots > 0 ? "text-yellow-600" : ""}`}
          >
            {stats.enrolledPilots}
          </div>
          <p className="text-xs text-muted-foreground">
            Total pilot you have subscribed
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Pilots in Progress
          </CardTitle>
          <Flag className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inProgressPilots}</div>
          <p className="text-xs text-muted-foreground">
            Total Pilots on progress
          </p>
        </CardContent>
      </Card>
    </>
  );
}
