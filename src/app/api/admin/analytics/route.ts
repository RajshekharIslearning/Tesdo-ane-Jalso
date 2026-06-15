import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalVendors,
      pendingVendors,
      approvedVendors,
      totalRatings,
      totalUsers,
      pendingReports,
      unreadMessages,
      topLocalitiesRaw,
    ] = await Promise.all([
      prisma.vendor.count(),
      prisma.vendor.count({ where: { status: "PENDING" } }),
      prisma.vendor.count({ where: { status: "APPROVED" } }),
      prisma.rating.count(),
      prisma.user.count(),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.vendor.groupBy({
        by: ["locality"],
        where: { status: "APPROVED" },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ]);

    const topLocalities = topLocalitiesRaw.map((r) => ({
      locality: r.locality,
      count: r._count.id,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalVendors,
        pendingVendors,
        approvedVendors,
        totalRatings,
        totalUsers,
        pendingReports,
        unreadMessages,
        topLocalities,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/analytics]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}
