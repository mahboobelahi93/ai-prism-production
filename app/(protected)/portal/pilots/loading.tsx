import { IBreadcrumbItem } from "@/types";

import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";
import { CustomBreadcrumb } from "@/components/shared/custom-breadcrumb";

export default function PilotsLoading() {
  const breadcrumbItems: IBreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Pilots" },
  ];
  return (
    <>
      <CustomBreadcrumb items={breadcrumbItems} />
      <DashboardHeader heading="Pilots" text="Check and manage your Pilots." />
      {/* <Skeleton className="size-full rounded-lg" /> */}
      <div className="space-y-4">
        {/* Form Title */}
        <Skeleton className="h-6 w-[200px]" />

        {/* Form Fields */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" /> {/* Label */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Input field */}
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" /> {/* Label */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Input field */}
        </div>

        {/* Dropdown */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" /> {/* Label */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Dropdown */}
        </div>

        {/* Submit Button */}
        <Skeleton className="h-10 w-[100px] rounded-md" />
      </div>
    </>
  );
}
