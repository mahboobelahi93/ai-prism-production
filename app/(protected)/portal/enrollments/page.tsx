import { IBreadcrumbItem } from "@/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EnrollmentList } from "@/components/dashboard/enrollment-list";
import { DashboardHeader } from "@/components/dashboard/header";
import { CustomBreadcrumb } from "@/components/shared/custom-breadcrumb";

export default function UserListPage() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "User List" },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbItems} />
      <DashboardHeader
        heading="User Enrollments"
        text="Manage all enrollment requests and statuses for all pilot courses."
      />
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader></CardHeader>
          <CardContent>
            <EnrollmentList showPagination={true} limit={10} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
