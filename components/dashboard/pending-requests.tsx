import { getAllEnrollments } from "@/actions/enrollments";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PendingRequestsClient } from "./pending-requests-client";

export default async function PendingRequests({
  limit = 5,
}: {
  limit?: number;
}) {
  // Use the same approach as your EnrollmentList component
  const allEnrollments = await getAllEnrollments();

  // Filter to get only pending enrollments
  const pendingEnrollments = allEnrollments.filter(
    (enrollment) => enrollment.status === "PENDING",
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>
              Recent enrollment requests that need your attention
            </CardDescription>
          </div>
          {pendingEnrollments.length > 0 && (
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800"
            >
              {pendingEnrollments.length} pending
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <PendingRequestsClient
          pendingEnrollments={pendingEnrollments}
          limit={limit}
        />
      </CardContent>
    </Card>
  );
}
