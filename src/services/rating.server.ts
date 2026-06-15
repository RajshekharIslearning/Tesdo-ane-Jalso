import { prisma } from "@/lib/prisma";

export async function createRating(data: {
  vendorId: string;
  stars: number;
  comment?: string;
  userId?: string;
  fingerprint?: string;
}) {
  const { vendorId, stars, comment, userId, fingerprint } = data;

  // Upsert rating
  const rating = await prisma.rating.create({
    data: { vendorId, stars, comment: comment || null, userId: userId || null, fingerprint: fingerprint || null },
  });

  // Update vendor aggregate
  await prisma.vendor.update({
    where: { id: vendorId },
    data: {
      ratingSum: { increment: stars },
      ratingCount: { increment: 1 },
    },
  });

  return rating;
}

export async function deleteRating(ratingId: string) {
  const rating = await prisma.rating.findUnique({ where: { id: ratingId } });
  if (!rating) throw new Error("Rating not found");

  await prisma.rating.delete({ where: { id: ratingId } });

  // Recalculate vendor aggregate
  await prisma.vendor.update({
    where: { id: rating.vendorId },
    data: {
      ratingSum: { decrement: rating.stars },
      ratingCount: { decrement: 1 },
    },
  });

  return rating;
}

export async function hasUserRated(vendorId: string, userId?: string, fingerprint?: string) {
  if (!userId && !fingerprint) return false;

  const where = userId
    ? { vendorId, userId }
    : { vendorId, fingerprint: fingerprint! };

  const existing = await prisma.rating.findFirst({ where });
  return !!existing;
}

export async function getVendorRatings(vendorId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const [ratings, total] = await Promise.all([
    prisma.rating.findMany({
      where: { vendorId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { user: { select: { id: true, name: true, image: true } } },
    }),
    prisma.rating.count({ where: { vendorId } }),
  ]);
  return { ratings, total, hasMore: skip + ratings.length < total };
}

export async function getRatingDistribution(vendorId: string) {
  const ratings = await prisma.rating.findMany({
    where: { vendorId },
    select: { stars: true },
  });

  const dist = [0, 0, 0, 0, 0];
  for (const r of ratings) {
    if (r.stars >= 1 && r.stars <= 5) dist[r.stars - 1]++;
  }

  return { 1: dist[0], 2: dist[1], 3: dist[2], 4: dist[3], 5: dist[4] };
}
