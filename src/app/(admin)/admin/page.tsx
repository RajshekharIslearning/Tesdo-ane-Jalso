import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  const [totalVendors, pendingVendors, approvedVendors, totalRatings, pendingReports, unreadMessages, topLocalities] =
    await Promise.all([
      prisma.vendor.count(),
      prisma.vendor.count({ where: { status: "PENDING" } }),
      prisma.vendor.count({ where: { status: "APPROVED" } }),
      prisma.rating.count(),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.vendor.groupBy({ by: ["locality"], where: { status: "APPROVED" }, _count: { id: true }, orderBy: { _count: { id: "desc" } }, take: 5 }),
    ]);

  const stats = [
    { label: "Total Vendors", value: totalVendors, sub: `${pendingVendors} pending review`, color: "var(--brand)" },
    { label: "Approved Vendors", value: approvedVendors, sub: "Live on platform", color: "var(--jade)" },
    { label: "Total Ratings", value: totalRatings, sub: "Community reviews", color: "var(--gold)" },
    { label: "Pending Reports", value: pendingReports, sub: "Needs moderation", color: pendingReports > 0 ? "oklch(0.60 0.16 25)" : "var(--text-muted)" },
    { label: "Unread Messages", value: unreadMessages, sub: "Contact form", color: unreadMessages > 0 ? "oklch(0.60 0.16 25)" : "var(--text-muted)" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>Overview of your Ahmedabad Street Eats platform</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
        {stats.map(({ label, value, sub, color }) => (
          <div key={label} className="card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color, marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>{value}</div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.125rem" }}>{label}</div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Top localities */}
      <div className="card" style={{ padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>
          🗺️ Top 5 Localities by Vendor Count
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {topLocalities.map((l, i) => (
            <div key={l.locality} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--surface-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500 }}>{l.locality}</span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{l._count.id} vendors</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${(l._count.id / topLocalities[0]._count.id) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
