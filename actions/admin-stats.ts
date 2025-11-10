"use server";

import { auth } from "@clerk/nextjs/server";

import { getCurrentUser, getCurrentUserId } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";

export async function getAdminStats() {
  try {
    // Check if user is authenticated and is a SUPERADMIN
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    console.log("User ID:", userId);

    // Get user role to verify SUPERADMIN access
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    console.log("User Role:", user?.role);

    if (!user || user.role !== "SUPERADMIN") {
      throw new Error("Forbidden - Superadmin access required");
    }

    // Get current date for recent activity calculations
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [
      // User stats
      totalUsers,
      activeUsers,
      suspendedUsers,
      usersByRole,
      newUsersToday,
      newUsersWeek,

      // Pilot stats
      totalPilots,
      publishedPilots,
      draftPilots,
      newPilotsToday,
      newPilotsWeek,

      // Lesson stats
      totalLessons,
      publishedLessons,
      draftLessons,
      newLessonsToday,
      newLessonsWeek,

      // File stats
      totalFiles,
      totalFileSize,

      // Enrollment stats
      totalEnrollments,
      enrollmentsByStatus,

      // Quiz stats
      totalQuizzes,
      totalQuizAttempts,

      // Schedule stats
      totalSchedules,
      schedulesByStatus,

      // Notes stats
      totalNotes,
    ] = await Promise.all([
      // User queries
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.groupBy({
        by: ["role"],
        _count: { role: true },
      }),
      prisma.user.count({
        where: { createdAt: { gte: today } },
      }),
      prisma.user.count({
        where: { createdAt: { gte: weekAgo } },
      }),

      // Pilot queries
      prisma.pilot.count(),
      prisma.pilot.count({ where: { isPublished: true } }),
      prisma.pilot.count({ where: { isPublished: false } }),
      prisma.pilot.count({
        where: { createdAt: { gte: today } },
      }),
      prisma.pilot.count({
        where: { createdAt: { gte: weekAgo } },
      }),

      // Lesson queries
      prisma.lesson.count(),
      prisma.lesson.count({ where: { isPublished: true } }),
      prisma.lesson.count({ where: { isPublished: false } }),
      prisma.lesson.count({
        where: { createdAt: { gte: today } },
      }),
      prisma.lesson.count({
        where: { createdAt: { gte: weekAgo } },
      }),

      // File queries
      prisma.file.count(),
      prisma.file.aggregate({
        _sum: { size: true },
      }),

      // Enrollment queries
      prisma.enrollActivity.count(),
      prisma.enrollActivity.groupBy({
        by: ["enrollStatus"],
        _count: { enrollStatus: true },
      }),

      // Quiz queries
      prisma.quizInfo.count(),
      prisma.quizAttempt.count(),

      // Schedule queries
      prisma.schedule.count(),
      prisma.schedule.groupBy({
        by: ["status"],
        _count: { status: true },
      }),

      // Notes queries
      prisma.note.count(),
    ]);

    // Process role distribution
    const roleDistribution = usersByRole.reduce((acc, item) => {
      acc[item.role] = item._count.role;
      return acc;
    }, {});

    // Process enrollment status
    const enrollmentStatusCounts = enrollmentsByStatus.reduce((acc, item) => {
      acc[item.enrollStatus.toLowerCase()] = item._count.enrollStatus;
      return acc;
    }, {});

    // Process schedule status
    const scheduleStatusCounts = schedulesByStatus.reduce((acc, item) => {
      acc[item.status.toLowerCase()] = item._count.status;
      return acc;
    }, {});

    // Calculate storage limit (you can make this configurable)
    const storageLimit = 2 * 1024 * 1024 * 1024 * 1024; // 2TB in bytes

    // Return the stats object
    return {
      success: true,
      data: {
        // User stats
        totalUsers,
        activeUsers,
        suspendedUsers,
        usersByRole: roleDistribution,

        // Pilot stats
        totalPilots,
        publishedPilots,
        draftPilots,

        // Lesson stats
        totalLessons,
        publishedLessons,
        draftLessons,

        // File stats
        totalFiles,
        totalFileSize: totalFileSize._sum.size || 0,
        storageLimit,

        // Enrollment stats
        totalEnrollments,
        pendingEnrollments: enrollmentStatusCounts.pending || 0,
        approvedEnrollments: enrollmentStatusCounts.approved || 0,
        rejectedEnrollments: enrollmentStatusCounts.rejected || 0,

        // Quiz stats
        totalQuizzes,
        totalQuizAttempts,

        // Schedule stats
        totalSchedules,
        pendingSchedules: scheduleStatusCounts.pending || 0,
        acceptedSchedules: scheduleStatusCounts.accepted || 0,
        finalizedSchedules: scheduleStatusCounts.finalizedviaemail || 0,

        // Notes stats
        totalNotes,

        // Recent activity
        recentActivity: {
          newUsersToday,
          newUsersWeek,
          newPilotsToday,
          newPilotsWeek,
          newLessonsToday,
          newLessonsWeek,
        },

        // Metadata
        lastUpdated: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch stats",
    };
  }
}

// Additional server actions for specific data
export async function getUserStats({
  search,
  role,
  status,
}: {
  search?: string;
  role?: string | null;
  status?: string | null;
} = {}) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== "SUPERADMIN") {
      throw new Error("Forbidden - Superadmin access required");
    }

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) where.role = role;
    if (status === "active") where.isActive = true;
    if (status === "suspended") where.isActive = false;

    const [filteredCount, activeCount, suspendedCount, total, usersByRole] =
      await Promise.all([
        prisma.user.count({ where }),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ where: { isActive: false } }),
        prisma.user.count(),
        prisma.user.groupBy({
          by: ["role"],
          _count: { role: true },
        }),
      ]);

    const roleDistribution = usersByRole.reduce((acc, item) => {
      acc[item.role] = item._count.role;
      return acc;
    }, {});

    return {
      success: true,
      data: {
        filteredCount,
        total,
        activeCount,
        suspendedCount,
        usersByRole: roleDistribution,
      },
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch user stats",
    };
  }
}

export async function getPilotStats({
  search,
  category,
  status,
}: {
  search?: string;
  category?: string | null;
  status?: string | null;
} = {}) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== "SUPERADMIN") {
      throw new Error("Forbidden - Superadmin access required");
    }

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) where.category = category;
    if (status === "published") where.isPublished = true;
    if (status === "draft") where.isPublished = false;

    const [filteredCount, publishedCount, draftCount, total, categories] =
      await Promise.all([
        prisma.pilot.count({ where }),
        prisma.pilot.count({ where: { isPublished: true } }),
        prisma.pilot.count({ where: { isPublished: false } }),
        prisma.pilot.count(),
        prisma.pilot.groupBy({
          by: ["category"],
          _count: { category: true },
        }),
      ]);

    const categoryDistribution = categories.reduce((acc, item) => {
      acc[item.category] = item._count.category;
      return acc;
    }, {});

    return {
      success: true,
      data: {
        filteredCount,
        total,
        publishedCount,
        draftCount,
        categoriesByCount: categoryDistribution,
      },
    };
  } catch (error) {
    console.error("Error fetching pilot stats:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch pilot stats",
    };
  }
}
