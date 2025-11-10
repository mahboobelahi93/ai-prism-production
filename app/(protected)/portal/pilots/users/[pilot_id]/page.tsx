"use server";

import { useSearchParams } from "next/navigation";

import { EnrollmentList } from "@/components/dashboard/enrollment-list";

export default async function EnrollmentsPage({
  params,
}: {
  params: { pilot_id: string };
}) {
  const { pilot_id } = params;

  if (!pilot_id) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <EnrollmentList pilot_id={pilot_id} showPagination={true} limit={10} />
    </div>
  );
}
