"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { LOCALITIES, SPECIALITIES, SORT_OPTIONS } from "@/constants";
import { getFoodImage } from "@/constants/food-images";
import { formatRating, pluralize } from "@/utils/format";
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
    <div className="container-page" style={{ paddingTop: "64px", paddingBottom: "120px" }}>

      {/* PAGE HEADER */}
      <div style={{ marginBottom: "64px", borderBottom: "1px solid var(--color-deep-charcoal)", paddingBottom: "24px" }}>
        <h1 className="display-xl" style={{ marginBottom: "16px" }}>
          The Directory.
        </h1>
        <p className="body-lg" style={{ color: "var(--color-on-surface-variant)", maxWidth: "600px" }}>
          Discover the best street food vendors across Ahmedabad. Filter by locality, speciality, or community rating.
        </p>
      </div>

      {/* FILTER BAR */}
      <div
        className="browse-filter-bar"
        style={{
          background: "var(--color-paper-ivory)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--border-subtle)",
          padding: "24px",
          marginBottom: "48px",
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        {/* Search */}
        <div style={{ flex: "1 1 240px", position: "relative" }}>
          <label className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginBottom: "8px" }}>Search</label>
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--color-outline)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Vendors or food..."
              className="input"
              style={{ paddingLeft: "42px", fontSize: "16px", background: "var(--color-surface)", border: "none", borderRadius: "var(--radius-lg)" }}
            />
          </div>
        </div>

        {/* Locality */}
        <div style={{ position: "relative", flex: "1 1 180px" }}>
          <label className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginBottom: "8px" }}>Locality</label>
          <div style={{ position: "relative" }}>
            <MapPin size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--color-outline)", pointerEvents: "none" }} />
            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="input"
              style={{ paddingLeft: "42px", appearance: "none", cursor: "pointer", fontSize: "16px", background: "var(--color-surface)", border: "none", borderRadius: "var(--radius-lg)" }}
            >
              <option value="">All Localities</option>
              {[...LOCALITIES].sort().map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Speciality */}
        <div style={{ position: "relative", flex: "1 1 180px" }}>
          <label className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginBottom: "8px" }}>Category</label>
          <select
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            className="input"
            style={{ appearance: "none", cursor: "pointer", fontSize: "16px", background: "var(--color-surface)", border: "none", borderRadius: "var(--radius-lg)" }}
          >
            <option value="">All Categories</option>
            {SPECIALITIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div style={{ position: "relative", flex: "1 1 180px" }}>
          <label className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginBottom: "8px" }}>Sort By</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input"
            style={{ appearance: "none", cursor: "pointer", fontSize: "16px", background: "var(--color-surface)", border: "none", borderRadius: "var(--radius-lg)" }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button onClick={clearFilters} className="btn btn-secondary" style={{ padding: "10px 20px" }}>
            Clear Filters
          </button>
        )}
      </div>

      {/* RESULT COUNT */}
      <div className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginBottom: "32px", borderBottom: "1px solid var(--border-default)", paddingBottom: "16px" }}>
        {loading ? "Searching Directory..." : `Showing ${pluralize(result?.total ?? 0, "Result")}`}
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
              gap: "24px",
              marginBottom: "64px",
            }}
          >
            {result!.data.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>

          {/* PAGINATION */}
          {result!.totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", alignItems: "center", borderTop: "1px solid var(--border-default)", paddingTop: "32px" }}>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn btn-secondary"
                style={{ opacity: page === 1 ? 0.4 : 1, padding: "8px 24px" }}
              >
                Previous
              </button>
              <span className="label-caps" style={{ color: "var(--color-on-surface-variant)" }}>
                Page {page} of {result!.totalPages}
              </span>
              <button
                disabled={!result!.hasMore}
                onClick={() => setPage((p) => p + 1)}
                className="btn btn-secondary"
                style={{ opacity: !result!.hasMore ? 0.4 : 1, padding: "8px 24px" }}
              >
                Next Page
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
  
  let signal = null;
  if (vendor.isFeatured) signal = "Must Try";
  else if (vendor.ratingCount >= 5 && avg >= 4.5) signal = "Top Rated";
  else if (vendor.ratingCount === 0) signal = "New";
  else if (vendor.isVerified) signal = "Verified";

  return (
    <Link href={`/vendor/${vendor.slug}`} style={{ textDecoration: "none" }}>
      <div className="card hover:shadow-[var(--shadow)] transition-all duration-300" style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-paper-ivory)", borderRadius: "var(--radius-xl)" }}>
        {/* Image */}
        <div
          style={{
            height: "180px",
            position: "relative",
            overflow: "hidden",
            background: vendor.primaryImage ? "var(--color-surface-dim)" : "var(--color-surface)",
          }}
        >
          {vendor.primaryImage ? (
            <Image
              src={vendor.primaryImage}
              alt={vendor.name}
              fill
              style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
              sizes="(max-width: 640px) 100vw, 300px"
            />
          ) : (
            <Image
              src={getFoodImage(vendor.speciality)}
              alt={vendor.speciality}
              fill
              style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
              sizes="(max-width: 640px) 100vw, 300px"
            />
          )}
          
          {/* Zomato-style Floating Rating Badge */}
          {avg > 0 && (
            <div 
              style={{ 
                position: "absolute", 
                top: "12px", 
                right: "12px", 
                background: avg >= 4.0 ? "var(--color-law-garden-green)" : "var(--color-street-saffron)", 
                color: "#fff", 
                padding: "4px 8px", 
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
              }}
            >
              {avg.toFixed(1)} <span style={{ fontSize: "10px" }}>★</span>
            </div>
          )}

          {/* Promoted / Signal Badge */}
          {signal && (
            <div 
              style={{ 
                position: "absolute", 
                bottom: "12px", 
                left: "12px", 
                background: "rgba(255,255,255,0.95)", 
                color: "var(--color-deep-charcoal)", 
                padding: "4px 8px", 
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "600",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              {signal}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "16px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
            <div
              className="headline-sm"
              style={{
                fontSize: "18px",
                lineHeight: 1.3,
                color: "var(--color-deep-charcoal)",
              }}
            >
              {vendor.name}
            </div>
          </div>

          <div className="body-md" style={{ color: "var(--color-on-surface-variant)", marginBottom: "4px", fontSize: "14px" }}>
            {vendor.speciality}
          </div>
          
          <div className="body-md" style={{ color: "var(--color-outline)", fontSize: "13px" }}>
            {vendor.locality}
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
        gap: "24px",
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card" style={{ height: "300px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-xl)", background: "var(--color-paper-ivory)", overflow: "hidden" }}>
          <div style={{ height: "180px", background: "var(--color-surface-dim)" }} />
          <div style={{ padding: "16px" }}>
            <div style={{ height: "18px", width: "70%", background: "var(--color-surface-dim)", marginBottom: "8px", borderRadius: "4px" }} />
            <div style={{ height: "14px", width: "40%", background: "var(--color-surface-dim)", marginBottom: "8px", borderRadius: "4px" }} />
            <div style={{ height: "14px", width: "50%", background: "var(--color-surface-dim)", borderRadius: "4px" }} />
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
        padding: "80px 32px",
        borderRadius: "var(--radius-xl)",
        border: "1px dashed var(--border-default)",
        background: "var(--color-paper-ivory)",
      }}
    >
      <h3 className="headline-md" style={{ marginBottom: "16px" }}>
        Nothing found.
      </h3>
      <p className="body-lg" style={{ color: "var(--color-on-surface-variant)", marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>
        Try different filters, or be the first to add a vendor here.
      </p>
      <button onClick={onAdd} className="btn btn-primary btn-lg">
        Add a Vendor
      </button>
    </div>
  );
}
