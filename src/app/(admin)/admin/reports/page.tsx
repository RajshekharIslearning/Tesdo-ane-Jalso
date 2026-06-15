import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatRelative } from "@/utils/format";

export const metadata: Metadata = { title: "Reports — Admin" };

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({ orderBy: { createdAt: "desc" }, include: { vendor: { select: { name: true, slug: true } } } });

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "1.75rem", letterSpacing: "-0.02em" }}>Reports</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {reports.map((r) => (
          <div key={r.id} className="card" style={{ padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.375rem", flexWrap: "wrap" }}>
                  <span className={`badge ${r.status === "PENDING" ? "badge-gold" : r.status === "RESOLVED" ? "badge-jade" : "badge-subtle"}`} style={{ fontSize: "0.7rem" }}>{r.status}</span>
                  <span className="badge badge-subtle" style={{ fontSize: "0.7rem" }}>{r.type}</span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{formatRelative(r.createdAt)}</span>
                </div>
                <div style={{ fontSize: "0.9375rem", color: "var(--text-primary)", fontWeight: 500, marginBottom: "0.25rem" }}>{r.reason}</div>
                {r.details && <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{r.details}</div>}
                {r.vendor && <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Vendor: {r.vendor.name}</div>}
              </div>
            </div>
          </div>
        ))}
        {reports.length === 0 && <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>No reports yet.</div>}
      </div>
    </div>
  );
}
