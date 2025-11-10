import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/actions/admin-stats";
import { getUsers } from "@/actions/users";
import { UserRole } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EnrollmentList } from "@/components/dashboard/enrollment-list";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import PilotOwnerList from "@/components/dashboard/pilotowner-list";
import UserInfoCard from "@/components/dashboard/userinfo-card";
import UserListTable from "@/components/users/user-list";

import { DashboardContent } from "../dashboard/dashboard-content";

export const metadata = constructMetadata({
  title: "Dashboard – Next Template",
  description: "Dashboard page for user and admin management.",
});

export default async function AdminPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    role?: string;
    status?: string;
  };
}) {
  const user = await getCurrentUser();

  // const pilotsData = await getAllPilots();
  // const { pilots, stats } = pilotsData.data;
  // const enrolledPilots = pilots.filter((pilot) => pilot.isEnrolled);

  if (!user) redirect("/login");

  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const search = searchParams.search || "";
  const roleFilter = searchParams.role || null;
  const statusFilter = searchParams.status || null;

  // ✅ Fetch directly on server
  const {
    data: users,
    total,
    filteredCount,
    activeCount,
    suspendedCount,
  } = await getUsers({
    page,
    pageSize,
    search,
    role: roleFilter,
    status: statusFilter,
  });

  // ✅ Example dashboard metrics
  const totalUsers = total;
  const activeUsers = activeCount;
  const suspendedUsers = suspendedCount;

  const statsResult = await getAdminStats();
  const adminStats = statsResult.success ? statsResult.data : null;

  return (
    <>
      {user.role === UserRole.USER ? (
        <>
          <DashboardHeader
            heading="User Panel"
            text="Welcome to the user dashboard. Here you can access your information and enrollments."
          />
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <UserInfoCard />
            </div>
            <PilotOwnerList />
            {/* <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Enrollments</CardTitle>
                  <CardDescription>View your enrolled Pilots</CardDescription>
                </div>
                <Button size="sm" className="shrink-0 gap-1 px-4">
                  <Link
                    href="/portal/user-enrollments"
                    className="flex items-center gap-2"
                  >
                    <span>View All</span>
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <EnrollmentList pilots={enrolledPilots} limit={5} />
              </CardContent>
            </Card> */}
          </div>
        </>
      ) : user.role === UserRole.PILOTOWNER ? (
        <>
          {/* <DashboardHeader
            heading="PILOTOWNER Panel"
            text="Access only for users with PILOT OWNER role. Manage users and enrollments."
          /> */}
          <DashboardContent>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard />
              </div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Enrollments</CardTitle>
                    <CardDescription>
                      Manage recent enrollment requests for your courses
                    </CardDescription>
                  </div>
                  <Button size="sm" className="shrink-0 gap-1 px-4">
                    <Link
                      href="/portal/enrollments"
                      className="flex items-center gap-2"
                    >
                      <span>View All</span>
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <EnrollmentList limit={10} pilot_id={user.id} />
                </CardContent>
              </Card>
            </div>
          </DashboardContent>
        </>
      ) : (
        <>
          <div className="space-y-6 p-6">
            {/* Dashboard Metrics */}
            {/* Comprehensive Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Users Stats */}
              <div className="rounded-2xl border p-4 shadow-sm">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Total members
                </h2>
                <p className="text-2xl font-bold">
                  {adminStats?.totalUsers ?? totalUsers ?? 0}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {adminStats?.usersByRole?.SUPERADMIN ?? 0} Super Admin •{" "}
                  {adminStats?.usersByRole?.USER ?? 0} Pilot User •{" "}
                  {adminStats?.usersByRole?.PILOTOWNER ?? 0} Pilot Owner •{" "}
                  {adminStats?.suspendedUsers ?? 0} suspended
                </p>
              </div>

              {/* Pilots Stats */}
              <div className="rounded-2xl border p-4 shadow-sm">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Total Pilots
                </h2>
                <p className="text-2xl font-bold text-blue-600">
                  {adminStats?.totalPilots || 0}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {adminStats?.publishedPilots || 0} published •{" "}
                  {adminStats?.draftPilots || 0} drafts
                </p>
              </div>

              {/* Lessons Stats */}
              <div className="rounded-2xl border p-4 shadow-sm">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Total Lessons
                </h2>
                <p className="text-2xl font-bold text-purple-600">
                  {adminStats?.totalLessons || 0}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {adminStats?.publishedLessons || 0} published •{" "}
                  {adminStats?.draftLessons || 0} unpublished
                </p>
              </div>

              {/* Storage Stats */}
              <div className="rounded-2xl border p-4 shadow-sm">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Files & Storage
                </h2>
                <p className="text-2xl font-bold text-orange-600">
                  {adminStats?.totalFiles || 0}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {adminStats
                    ? `${Math.round((adminStats.totalFileSize / adminStats.storageLimit) * 100)}% used on 2TB`
                    : "Loading..."}
                </p>
              </div>
            </div>

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border p-4 shadow-sm">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Enrollments
                </h2>
                <p className="text-2xl font-bold text-green-600">
                  {adminStats?.totalEnrollments || 0}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {adminStats?.pendingEnrollments || 0} pending approval
                </p>
              </div>

              <div className="rounded-2xl border p-4 shadow-sm">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Quiz Attempts
                </h2>
                <p className="text-2xl font-bold text-indigo-600">
                  {adminStats?.totalQuizAttempts || 0}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Across {adminStats?.totalQuizzes || 0} quizzes
                </p>
              </div>

              <div className="rounded-2xl border p-4 shadow-sm">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Schedules
                </h2>
                <p className="text-2xl font-bold text-pink-600">
                  {adminStats?.totalSchedules || 0}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {adminStats?.pendingSchedules || 0} pending
                </p>
              </div>
            </div>

            {/* User List Table */}
            <div>
              <UserListTable
                data={users}
                total={filteredCount}
                page={page}
                pageSize={pageSize}
                search={search}
                roleFilter={roleFilter}
                currentUrl="/dashboard"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
