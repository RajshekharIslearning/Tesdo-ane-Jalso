"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatRelative } from "@/utils/format";

type Vendor = {
  id: string;
  name: string;
  speciality: string;
  locality: string;
  status: string;
  isVerified: boolean;
  isFeatured: boolean;
  ratingSum: number;
  ratingCount: number;
  createdAt: Date;
};

export default function AdminVendorList({ initialVendors }: { initialVendors: Vendor[] }) {
  const [vendors, setVendors] = useState(initialVendors);
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL" ? vendors : vendors.filter((v) => v.status === filter);

  async function updateVendor(id: string, data: Partial<Vendor>) {
    try {
      const res = await fetch(`/api/vendors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, ...data } : v)));
        toast.success("Vendor updated");
      } else {
        toast.error(json.error ?? "Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function deleteVendor(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/vendors/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setVendors((prev) => prev.filter((v) => v.id !== id));
        toast.success("Vendor deleted");
      } else {
        toast.error(json.error ?? "Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {["ALL", "APPROVED", "PENDING", "REJECTED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
          >
            {f} ({f === "ALL" ? vendors.length : vendors.filter((v) => v.status === f).length})
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {filtered.map((v) => (
          <div
            key={v.id}
            className="card"
            style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text-primary)" }}>{v.name}</span>
                {v.isVerified && <span className="badge badge-jade" style={{ fontSize: "0.65rem" }}>✓ Verified</span>}
                {v.isFeatured && <span className="badge badge-gold" style={{ fontSize: "0.65rem" }}>⭐ Featured</span>}
                <span className={`badge ${v.status === "APPROVED" ? "badge-jade" : v.status === "PENDING" ? "badge-gold" : "badge-subtle"}`} style={{ fontSize: "0.65rem" }}>
                  {v.status}
                </span>
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                {v.speciality} · {v.locality} ·{" "}
                {v.ratingCount > 0 ? `★ ${(v.ratingSum / v.ratingCount).toFixed(1)} (${v.ratingCount})` : "No ratings"}{" "}
                · Added {formatRelative(v.createdAt)}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", flexShrink: 0 }}>
              {v.status === "PENDING" && (
                <button onClick={() => updateVendor(v.id, { status: "APPROVED" as unknown as Vendor["status"] })} className="btn btn-sm" style={{ background: "oklch(0.60 0.15 155 / 0.15)", color: "var(--jade)", border: "1px solid oklch(0.60 0.15 155 / 0.3)" }}>
                  ✓ Approve
                </button>
              )}
              {v.status !== "REJECTED" && (
                <button onClick={() => updateVendor(v.id, { status: "REJECTED" as unknown as Vendor["status"] })} className="btn btn-sm" style={{ background: "oklch(0.25 0.08 25)", color: "oklch(0.65 0.15 25)", border: "1px solid oklch(0.40 0.12 25)" }}>
                  ✗ Reject
                </button>
              )}
              <button
                onClick={() => updateVendor(v.id, { isFeatured: !v.isFeatured })}
                className="btn btn-secondary btn-sm"
              >
                {v.isFeatured ? "★ Unfeature" : "☆ Feature"}
              </button>
              <button
                onClick={() => updateVendor(v.id, { isVerified: !v.isVerified })}
                className="btn btn-secondary btn-sm"
              >
                {v.isVerified ? "✓ Unverify" : "✓ Verify"}
              </button>
              <button
                onClick={() => deleteVendor(v.id, v.name)}
                className="btn btn-sm"
                style={{ background: "oklch(0.25 0.08 25)", color: "oklch(0.65 0.15 25)", border: "1px solid oklch(0.40 0.12 25)" }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>No vendors in this category.</div>
        )}
      </div>
    </div>
  );
}
