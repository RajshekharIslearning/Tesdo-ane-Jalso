"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Filter, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { LOCALITIES, SPECIALITIES, SORT_OPTIONS } from "@/constants";
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
          border: "1px solid var(--color-deep-charcoal)",
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
          <label className="label-caps" style={{ color: "var(--color-deep-charcoal)", marginBottom: "8px" }}>Search</label>
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "var(--color-deep-charcoal)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Vendors or food..."
              className="input"
              style={{ paddingLeft: "32px", fontSize: "16px" }}
            />
          </div>
        </div>

        {/* Locality */}
        <div style={{ position: "relative", flex: "1 1 180px" }}>
          <label className="label-caps" style={{ color: "var(--color-deep-charcoal)", marginBottom: "8px" }}>Locality</label>
          <div style={{ position: "relative" }}>
            <MapPin size={18} style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", color: "var(--color-deep-charcoal)", pointerEvents: "none" }} />
            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="input"
              style={{ paddingLeft: "32px", appearance: "none", cursor: "pointer", fontSize: "16px" }}
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
          <label className="label-caps" style={{ color: "var(--color-deep-charcoal)", marginBottom: "8px" }}>Category</label>
          <select
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            className="input"
            style={{ appearance: "none", cursor: "pointer", fontSize: "16px" }}
          >
            <option value="">All Categories</option>
            {SPECIALITIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div style={{ position: "relative", flex: "1 1 180px" }}>
          <label className="label-caps" style={{ color: "var(--color-deep-charcoal)", marginBottom: "8px" }}>Sort By</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input"
            style={{ appearance: "none", cursor: "pointer", fontSize: "16px" }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button onClick={clearFilters} className="btn" style={{ border: "1px solid var(--color-deep-charcoal)", color: "var(--color-deep-charcoal)", background: "transparent", padding: "10px 20px" }}>
            Clear Filters
          </button>
        )}
      </div>

      {/* RESULT COUNT */}
      <div className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginBottom: "32px", borderBottom: "1px solid var(--color-deep-charcoal)", paddingBottom: "16px" }}>
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
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
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
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", alignItems: "center", borderTop: "1px solid var(--color-deep-charcoal)", paddingTop: "32px" }}>
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

  return (
    <Link href={`/vendor/${vendor.slug}`} style={{ textDecoration: "none" }}>
      <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Image / Typographic Placeholder */}
        <div
          style={{
            height: "240px",
            borderBottom: "1px solid var(--color-deep-charcoal)",
            position: "relative",
            overflow: "hidden",
            background: vendor.primaryImage ? "var(--color-surface-dim)" : "var(--color-chai-cream)",
          }}
        >
          {vendor.primaryImage ? (
            <Image
              src={vendor.primaryImage}
              alt={vendor.name}
              fill
              style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
              sizes="(max-width: 640px) 100vw, 300px"
              className="hover:scale-105"
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
                padding: "24px",
                textAlign: "center",
              }}
            >
              <div className="display-xl" style={{ fontSize: "80px", color: "var(--color-paper-ivory)", opacity: 0.1, lineHeight: 1 }}>
                {vendor.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          
          <div style={{ position: "absolute", top: 16, left: 16, display: "flex", flexDirection: "column", gap: "8px" }}>
            {vendor.isFeatured && (
              <div
                className="label-caps"
                style={{
                  background: "var(--color-deep-charcoal)",
                  color: "var(--color-paper-ivory)",
                  padding: "4px 8px",
                  border: "1px solid var(--color-deep-charcoal)",
                }}
              >
                Featured
              </div>
            )}
            {vendor.isVerified && (
              <div
                className="label-caps"
                style={{
                  background: "var(--color-law-garden-green)",
                  color: "white",
                  padding: "4px 8px",
                  border: "1px solid var(--color-law-garden-green)",
                }}
              >
                Verified
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <div
              className="headline-sm"
              style={{
                fontSize: "22px",
                lineHeight: 1.2,
                color: "var(--color-deep-charcoal)",
              }}
            >
              {vendor.name}
            </div>
            {avg > 0 && (
              <div className="label-caps" style={{ color: "var(--color-street-saffron)", minWidth: "40px", textAlign: "right" }}>
                ★ {avg.toFixed(1)}
              </div>
            )}
          </div>

          <div className="body-md" style={{ color: "var(--color-deep-charcoal)", marginBottom: "4px" }}>
            {vendor.speciality}
          </div>
          
          <div className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginBottom: "24px" }}>
            {vendor.locality}
          </div>

          <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--border-default)" }}>
            <span className="label-caps" style={{ color: "var(--color-on-surface-variant)" }}>
              {vendor.isFeatured ? "Editorial Pick" : vendor.isVerified ? "Verified Vendor" : vendor.ratingCount === 0 ? "New Addition" : vendor.ratingCount >= 5 && avg >= 4.5 ? "Community Favourite" : pluralize(vendor.ratingCount, "Community Review")}
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
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "24px",
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ border: "1px solid var(--color-deep-charcoal)", background: "var(--color-paper-ivory)" }}>
          <div style={{ height: "240px", background: "var(--color-surface-dim)", borderBottom: "1px solid var(--color-deep-charcoal)" }} />
          <div style={{ padding: "24px" }}>
            <div style={{ height: "24px", width: "70%", background: "var(--color-surface-dim)", marginBottom: "16px" }} />
            <div style={{ height: "16px", width: "40%", background: "var(--color-surface-dim)", marginBottom: "24px" }} />
            <div style={{ height: "1px", background: "var(--color-deep-charcoal)", opacity: 0.1, marginBottom: "16px" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ height: "14px", width: "60px", background: "var(--color-surface-dim)" }} />
              <div style={{ height: "14px", width: "40px", background: "var(--color-surface-dim)" }} />
            </div>
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
        border: "1px solid var(--color-deep-charcoal)",
        background: "var(--color-paper-ivory)",
      }}
    >
      <div style={{ fontSize: "64px", marginBottom: "24px" }}>🔍</div>
      <h3 className="headline-md" style={{ marginBottom: "16px" }}>
        No results found.
      </h3>
      <p className="body-lg" style={{ color: "var(--color-on-surface-variant)", marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>
        We couldn't find any vendors matching your criteria. Be the first to add one to the directory!
      </p>
      <button onClick={onAdd} className="btn btn-primary btn-lg">
        Submit a Vendor
      </button>
    </div>
  );
}
