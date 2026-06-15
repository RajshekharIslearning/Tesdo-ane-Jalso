import { prisma } from "@/lib/prisma";
import { Vendor } from "@prisma/client";
import { generateSlug, uniqueSlug } from "@/utils/slug";
import type { VendorSummary, PaginatedResult, LocalityRanking } from "@/types";
import type { VendorSearchParams } from "@/schemas";

// ============================
// HELPERS
// ============================

function toSummary(v: Vendor & { images?: { url: string; isPrimary: boolean }[] }): VendorSummary {
  const primaryImage = v.images?.find((i) => i.isPrimary)?.url ?? v.images?.[0]?.url;
  return {
    id: v.id,
    slug: v.slug,
    name: v.name,
    speciality: v.speciality,
    locality: v.locality,
    address: v.address,
    isVerified: v.isVerified,
    isFeatured: v.isFeatured,
    status: v.status,
    ratingSum: v.ratingSum,
    ratingCount: v.ratingCount,
    createdAt: v.createdAt,
    primaryImage,
    averageRating: v.ratingCount > 0 ? v.ratingSum / v.ratingCount : 0,
  };
}

// ============================
// READ OPERATIONS
// ============================

export async function getVendors(params: VendorSearchParams): Promise<PaginatedResult<VendorSummary>> {
  const { search, locality, speciality, sort, page, limit } = params;
  const skip = (page - 1) * limit;

  const where = {
    status: "APPROVED",
    ...(locality ? { locality } : {}),
    ...(speciality ? { speciality } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { speciality: { contains: search, mode: "insensitive" as const } },
            { locality: { contains: search, mode: "insensitive" as const } },
            { address: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "newest"
      ? { createdAt: "desc" as const }
      : sort === "most_rated"
      ? { ratingCount: "desc" as const }
      : sort === "name"
      ? { name: "asc" as const }
      : { ratingSum: "desc" as const }; // default: highest rated

  const [vendors, total] = await Promise.all([
    prisma.vendor.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { images: { select: { url: true, isPrimary: true }, take: 1 } },
    }),
    prisma.vendor.count({ where }),
  ]);

  return {
    data: vendors.map(toSummary),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasMore: skip + vendors.length < total,
  };
}

export async function getVendorBySlug(slug: string) {
  return prisma.vendor.findUnique({
    where: { slug },
    include: {
      images: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] },
      ratings: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      _count: { select: { favorites: true, ratings: true } },
    },
  });
}

export async function getFeaturedVendors(): Promise<VendorSummary[]> {
  const vendors = await prisma.vendor.findMany({
    where: { status: "APPROVED", isFeatured: true },
    orderBy: { ratingSum: "desc" },
    take: 6,
    include: { images: { select: { url: true, isPrimary: true }, take: 1 } },
  });
  return vendors.map(toSummary);
}

export async function getTopRatedVendors(limit = 3): Promise<VendorSummary[]> {
  const vendors = await prisma.vendor.findMany({
    where: { status: "APPROVED", ratingCount: { gte: 1 } },
    orderBy: [{ ratingSum: "desc" }, { ratingCount: "desc" }],
    take: limit,
    include: { images: { select: { url: true, isPrimary: true }, take: 1 } },
  });
  return vendors.map(toSummary);
}

export async function getLocalityRankings(): Promise<LocalityRanking[]> {
  const vendors = await prisma.vendor.findMany({
    where: { status: "APPROVED" },
    select: {
      id: true,
      slug: true,
      name: true,
      speciality: true,
      locality: true,
      address: true,
      isVerified: true,
      isFeatured: true,
      status: true,
      ratingSum: true,
      ratingCount: true,
      createdAt: true,
      images: { select: { url: true, isPrimary: true }, take: 1 },
    },
  });

  const byLocality: Record<string, typeof vendors> = {};
  for (const v of vendors) {
    if (!byLocality[v.locality]) byLocality[v.locality] = [];
    byLocality[v.locality].push(v);
  }

  return Object.entries(byLocality)
    .map(([locality, vs]) => {
      const withRatings = vs.filter((v) => v.ratingCount > 0);
      const avgRating = withRatings.length
        ? withRatings.reduce((a, v) => a + v.ratingSum / v.ratingCount, 0) / withRatings.length
        : 0;
      const totalRatings = vs.reduce((a, v) => a + v.ratingCount, 0);

      const topVendors = [...vs]
        .sort((a, b) => {
          const ra = a.ratingCount ? a.ratingSum / a.ratingCount : 0;
          const rb = b.ratingCount ? b.ratingSum / b.ratingCount : 0;
          return rb - ra;
        })
        .slice(0, 3)
        .map((v) => ({
          ...v,
          primaryImage: v.images?.[0]?.url,
          averageRating: v.ratingCount > 0 ? v.ratingSum / v.ratingCount : 0,
        }));

      return { locality, vendorCount: vs.length, averageRating: avgRating, totalRatings, topVendors };
    })
    .sort((a, b) => b.averageRating - a.averageRating || b.vendorCount - a.vendorCount);
}

export async function getRecentVendors(limit = 6): Promise<VendorSummary[]> {
  const vendors = await prisma.vendor.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { images: { select: { url: true, isPrimary: true }, take: 1 } },
  });
  return vendors.map(toSummary);
}

export async function getSiteStats() {
  const [totalVendors, totalRatings, totalLocalities] = await Promise.all([
    prisma.vendor.count({ where: { status: "APPROVED" } }),
    prisma.rating.count(),
    prisma.vendor.groupBy({ by: ["locality"], where: { status: "APPROVED" }, _count: true }).then((g) => g.length),
  ]);
  return { totalVendors, totalRatings, totalLocalities };
}

// ============================
// WRITE OPERATIONS
// ============================

export async function createVendor(data: {
  name: string;
  speciality: string;
  locality: string;
  address?: string;
  description?: string;
  addedById?: string;
}) {
  let slug = generateSlug(data.name);
  // Check uniqueness
  const exists = await prisma.vendor.findUnique({ where: { slug } });
  if (exists) slug = uniqueSlug(slug);

  return prisma.vendor.create({
    data: {
      ...data,
      slug,
      status: "APPROVED", // auto-approve for now; change to PENDING for moderation
    },
  });
}

export async function updateVendor(id: string, data: Partial<Vendor>) {
  return prisma.vendor.update({ where: { id }, data });
}

export async function deleteVendor(id: string) {
  return prisma.vendor.delete({ where: { id } });
}

export async function getVendorNames(locality?: string) {
  return prisma.vendor.findMany({
    where: { status: "APPROVED", ...(locality ? { locality } : {}) },
    select: { id: true, name: true, locality: true },
  });
}
