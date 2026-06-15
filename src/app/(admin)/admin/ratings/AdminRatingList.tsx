"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatRelative } from "@/utils/format";
import Link from "next/link";

type Rating = { id: string; stars: number; comment: string | null; fingerprint: string | null; createdAt: Date; vendor: { id: string; name: string; slug: string }; user: { name: string | null } | null; };

export default function AdminRatingList({ initialRatings }: { initialRatings: Rating[] }) {
  const [ratings, setRatings] = useState(initialRatings);

  async function deleteRating(id: string) {
    if (!confirm("Delete this rating? The vendor's average will be recalculated.")) return;
    try {
      const res = await fetch(`/api/admin/ratings/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) { setRatings((prev) => prev.filter((r) => r.id !== id)); toast.success("Rating deleted"); }
      else toast.error(json.error ?? "Failed");
    } catch { toast.error("Something went wrong"); }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {ratings.map((r) => (
        <div key={r.id} className="card" style={{ padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.25rem" }}>
              {[1,2,3,4,5].map((s) => <span key={s} style={{ color: s <= r.stars ? "var(--gold)" : "var(--surface-subtle)", fontSize: "0.875rem" }}>★</span>)}
              <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginLeft: "0.375rem" }}>{formatRelative(r.createdAt)}</span>
            </div>
            <Link href={`/vendor/${r.vendor.slug}`} style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", textDecoration: "none" }}>{r.vendor.name}</Link>
            {r.comment && <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>{r.comment}</p>}
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>By: {r.user?.name ?? `Anon (${r.fingerprint?.slice(0, 8) ?? "?"}...)`}</p>
          </div>
          <button onClick={() => deleteRating(r.id)} className="btn btn-sm" style={{ background: "oklch(0.25 0.08 25)", color: "oklch(0.65 0.15 25)", border: "1px solid oklch(0.40 0.12 25)", flexShrink: 0 }}>
            🗑 Delete
          </button>
        </div>
      ))}
      {ratings.length === 0 && <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>No ratings yet.</div>}
    </div>
  );
}
