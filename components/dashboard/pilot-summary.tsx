import { getAllPilots } from "@/actions/pilots";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function PilotSummary() {
  const pilotsData = await getAllPilots();
  const { pilots } = pilotsData.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilot Summary</CardTitle>
        <CardDescription>Overview of all active pilots</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {pilots.map((pilot) => {
              // Calculate enrollment percentage - adjust based on your data structure
              const enrollmentPercentage =
                (pilot.enrollmentCount / pilot.capacity) * 100 || 0;

              return (
                <div key={pilot.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{pilot.title}</p>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {pilot.description}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {pilot.enrollmentCount}/{pilot.capacity || "Unlimited"}
                    </div>
                  </div>
                  <Progress value={enrollmentPercentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
