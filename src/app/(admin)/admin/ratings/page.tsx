import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AdminRatingList from "./AdminRatingList";

export const metadata: Metadata = { title: "Manage Ratings — Admin" };

export default async function AdminRatingsPage() {
  const ratings = await prisma.rating.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { vendor: { select: { id: true, name: true, slug: true } }, user: { select: { name: true } } },
  });

  return (
    <div>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>Ratings</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>{ratings.length} most recent ratings</p>
      </div>
      <AdminRatingList initialRatings={ratings} />
    </div>
  );
}
