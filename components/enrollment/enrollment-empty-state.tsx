interface EnrollmentEmptyStateProps {
  statusFilter: string;
}

export function EnrollmentEmptyState({
  statusFilter,
}: EnrollmentEmptyStateProps) {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-semibold">
          There are no{" "}
          {statusFilter !== "ALL" ? statusFilter.toLowerCase() : ""}{" "}
          enrollments.
        </p>
      </div>
    </div>
  );
}
