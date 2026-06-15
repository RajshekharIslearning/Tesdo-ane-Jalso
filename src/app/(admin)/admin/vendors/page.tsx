import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AdminVendorList from "./AdminVendorList";

export const metadata: Metadata = { title: "Manage Vendors — Admin" };

export default async function AdminVendorsPage() {
  const vendors = await prisma.vendor.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { select: { url: true, isPrimary: true }, take: 1 } },
  });

  return (
    <div>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>
          Vendors
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>{vendors.length} vendors total</p>
      </div>
      <AdminVendorList initialVendors={vendors} />
    </div>
  );
}
