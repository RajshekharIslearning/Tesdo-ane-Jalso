"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Filter, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { LOCALITIES, SPECIALITIES, SPECIALITY_EMOJIS, SORT_OPTIONS } from "@/constants";
import { formatRating } from "@/utils/format";
import { useDebounce } from "@/hooks/useDebounce";

type VendorSummary = {
  id: string;
  slug: string;
  name: string;
  speciality: string;
  locality: string;
  address?: string | null;
  isVerified: boolean;
  isFeatured: boolean;
  ratingSum: number;
  ratingCount: number;
  createdAt: string;
  primaryImage?: string;
  averageRating: number;
};

type BrowseResult = {
  data: VendorSummary[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
};

export default function BrowseClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [locality, setLocality] = useState(searchParams.get("locality") ?? "");
  const [speciality, setSpeciality] = useState(searchParams.get("speciality") ?? "");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "rating");
  const [page, setPage] = useState(1);

  const [result, setResult] = useState<BrowseResult | null>(null);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 350);

  const fetchVendors = useCallback(async (params: URLSearchParams) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/vendors?${params}`);
      const data = await res.json();
      if (data.success) setResult(data);
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (locality) params.set("locality", locality);
    if (speciality) params.set("speciality", speciality);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "12");
    fetchVendors(params);
  }, [debouncedSearch, locality, speciality, sort, page, fetchVendors]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, locality, speciality, sort]);

  const clearFilters = () => {
    setSearch("");
    setLocality("");
    setSpeciality("");
    setSort("rating");
  };

  const hasFilters = search || locality || speciality || sort !== "rating";

  return (
    <div className="container-page" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>

      {/* PAGE HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}
        >
          Browse Vendors
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
          Discover and rate the best street food vendors across Ahmedabad
        </p>
      </div>

      {/* FILTER BAR */}
      <div
        className="browse-filter-bar"
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border-subtle)",
          borderRadius: 16,
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ flex: "1 1 200px", position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendors or food..."
            className="input"
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>

        {/* Locality */}
        <div style={{ position: "relative", flex: "0 0 auto" }}>
          <MapPin size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
          <select
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="input"
            style={{ paddingLeft: "2rem", minWidth: 150, appearance: "none", cursor: "pointer" }}
          >
            <option value="">All Localities</option>
            {[...LOCALITIES].sort().map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Speciality */}
        <div style={{ position: "relative", flex: "0 0 auto" }}>
          <select
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            className="input"
            style={{ minWidth: 160, appearance: "none", cursor: "pointer" }}
          >
            <option value="">All Categories</option>
            {SPECIALITIES.map((s) => (
              <option key={s} value={s}>{SPECIALITY_EMOJIS[s]} {s}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div style={{ position: "relative", flex: "0 0 auto" }}>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input"
            style={{ minWidth: 150, appearance: "none", cursor: "pointer" }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button onClick={clearFilters} className="btn btn-ghost btn-sm">
            ✕ Clear
          </button>
        )}
      </div>

      {/* RESULT COUNT */}
      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
        {loading ? "Searching..." : `${result?.total ?? 0} vendor${result?.total !== 1 ? "s" : ""} found`}
      </div>

      {/* VENDOR GRID */}
      {loading ? (
        <SkeletonGrid />
      ) : (result?.data.length ?? 0) === 0 ? (
        <EmptyState onAdd={() => router.push("/add")} />
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {result!.data.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>

          {/* PAGINATION */}
          {result!.totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", alignItems: "center" }}>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn btn-secondary btn-sm"
                style={{ opacity: page === 1 ? 0.4 : 1 }}
              >
                ← Prev
              </button>
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", padding: "0 0.5rem" }}>
                Page {page} of {result!.totalPages}
              </span>
              <button
                disabled={!result!.hasMore}
                onClick={() => setPage((p) => p + 1)}
                className="btn btn-secondary btn-sm"
                style={{ opacity: !result!.hasMore ? 0.4 : 1 }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ===================== VENDOR CARD =====================

function VendorCard({ vendor }: { vendor: VendorSummary }) {
  const avg = vendor.ratingCount > 0 ? vendor.ratingSum / vendor.ratingCount : 0;

  return (
    <Link href={`/vendor/${vendor.slug}`} style={{ textDecoration: "none" }}>
      <div className="card card-glow" style={{ overflow: "hidden", cursor: "pointer" }}>
        {/* Image */}
        <div
          style={{
            height: 160,
            background: "var(--surface-subtle)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {vendor.primaryImage ? (
            <Image
              src={vendor.primaryImage}
              alt={vendor.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 640px) 100vw, 300px"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <div style={{ fontSize: "3rem" }}>{SPECIALITY_EMOJIS[vendor.speciality] ?? "🍴"}</div>
            </div>
          )}
          {vendor.isFeatured && (
            <div
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                background: "oklch(0.70 0.19 55 / 0.9)",
                color: "#fff",
                fontSize: "0.6875rem",
                fontWeight: 600,
                padding: "0.2rem 0.5rem",
                borderRadius: 99,
              }}
            >
              ⭐ Featured
            </div>
          )}
          {vendor.isVerified && (
            <div
              style={{
                position: "absolute",
                top: vendor.isFeatured ? 32 : 8,
                left: 8,
                background: "oklch(0.60 0.15 155 / 0.9)",
                color: "#fff",
                fontSize: "0.6875rem",
                fontWeight: 600,
                padding: "0.2rem 0.5rem",
                borderRadius: 99,
              }}
            >
              ✓ Verified
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.375rem" }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: "var(--text-primary)",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {vendor.name}
            </div>
            {avg > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.2rem", flexShrink: 0 }}>
                <span style={{ color: "var(--gold)" }}>★</span>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--gold)" }}>
                  {avg.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
            {SPECIALITY_EMOJIS[vendor.speciality] ?? "🍴"} {vendor.speciality}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="badge badge-subtle" style={{ fontSize: "0.6875rem" }}>
              📍 {vendor.locality}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {vendor.ratingCount > 0 ? `${vendor.ratingCount} rating${vendor.ratingCount !== 1 ? "s" : ""}` : "No ratings yet"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ===================== SKELETON =====================

function SkeletonGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1rem",
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card" style={{ overflow: "hidden" }}>
          <div className="skeleton" style={{ height: 160 }} />
          <div style={{ padding: "1rem" }}>
            <div className="skeleton" style={{ height: 18, width: "70%", marginBottom: "0.5rem" }} />
            <div className="skeleton" style={{ height: 14, width: "50%", marginBottom: "0.75rem" }} />
            <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 99 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ===================== EMPTY STATE =====================

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "5rem 2rem",
        color: "var(--text-muted)",
      }}
    >
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
      <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
        No vendors found
      </h3>
      <p style={{ fontSize: "0.9375rem", marginBottom: "1.5rem" }}>
        Try adjusting your filters, or be the first to add a vendor!
      </p>
      <button onClick={onAdd} className="btn btn-primary">
        ➕ Add a Vendor
      </button>
    </div>
  );
}
