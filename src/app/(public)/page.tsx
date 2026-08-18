import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import {
  getFeaturedVendors,
  getTopRatedVendors,
  getRecentVendors,
  getSiteStats,
} from "@/services/vendor.server";
import { SPECIALITIES, LOCALITIES, SITE_CONFIG } from "@/constants";
import { formatRating, pluralize } from "@/utils/format";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — Ahmedabad's Community Food Guide`,
  description: SITE_CONFIG.description,
};

export default async function HomePage() {
  const [stats, topVendors, featuredVendors, recentVendors] = await Promise.all([
    getSiteStats(),
    getTopRatedVendors(3),
    getFeaturedVendors(),
    getRecentVendors(8), // Fetch more for dense list
  ]);

  const popularCategories = SPECIALITIES.slice(0, 8);
  const popularLocalities = LOCALITIES.slice(0, 8);

  return (
    <div>
      {/* ===================== HERO ===================== */}
      <section style={{ paddingTop: "120px", paddingBottom: "120px" }}>
        <div className="container-page">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "64px", alignItems: "center" }}>
            
            {/* Left Content */}
            <div style={{ paddingRight: "32px" }}>
              <div
                className="label-caps"
                style={{
                  color: "var(--color-street-saffron)",
                  marginBottom: "32px",
                }}
              >
                The City's Directory
              </div>

              <h1 className="display-xl" style={{ marginBottom: "24px" }}>
                Find your next <br />
                <span style={{ color: "var(--color-on-surface-variant)", fontStyle: "italic" }}>favourite spot.</span>
              </h1>

              <p className="body-lg" style={{ color: "var(--color-on-surface-variant)", marginBottom: "48px", maxWidth: "480px" }}>
                Ahmedabad's street food, documented and rated by the people who live here.
              </p>

              {/* Discovery Search */}
              <form action="/browse" method="GET" style={{ display: "flex", gap: "8px", maxWidth: "480px", marginBottom: "32px" }}>
                <div style={{ position: "relative", flexGrow: 1 }}>
                  <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--color-deep-charcoal)" }} />
                  <input 
                    name="search" 
                    placeholder="What are you craving?" 
                    className="input" 
                    style={{ paddingLeft: "48px", height: "56px", fontSize: "16px", background: "var(--color-paper-ivory)" }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: "56px", padding: "0 32px" }}>
                  Search
                </button>
              </form>
              
              <Link href="/add" className="label-caps hover:text-[var(--color-street-saffron)] transition-colors duration-200" style={{ color: "var(--color-on-surface-variant)", textDecoration: "none" }}>
                + Or submit a vendor
              </Link>
            </div>

            {/* Right Asymmetric Grid (Stats) */}
            {(stats.totalVendors > 5 || stats.totalRatings > 5) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {stats.totalVendors > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "48px" }}>
                    <div style={{ background: "var(--color-chai-cream)", padding: "32px", height: "240px", border: "1px solid var(--color-deep-charcoal)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      <div className="display-xl" style={{ fontSize: "48px", lineHeight: 1 }}>{stats.totalVendors}</div>
                      <div className="label-caps" style={{ marginTop: "16px" }}>Vendors Documented</div>
                    </div>
                  </div>
                )}
                {stats.totalRatings > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ background: "var(--color-street-saffron)", padding: "32px", height: "280px", border: "1px solid var(--color-deep-charcoal)", display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "white" }}>
                      <div className="display-xl" style={{ fontSize: "48px", lineHeight: 1, color: "white" }}>{stats.totalRatings}</div>
                      <div className="label-caps" style={{ color: "white", marginTop: "16px" }}>{pluralize(stats.totalRatings, "Community Log")}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <div className="container-page">
        {/* ===================== TOP RATED ===================== */}
        {topVendors.length > 0 && (
          <section style={{ marginBottom: "120px" }}>
            <SectionHeader title="Top Rated." subtitle="The highest community-rated picks right now." href="/browse?sort=rating" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {topVendors.map((vendor, i) => {
                const avg = vendor.ratingCount > 0 ? vendor.ratingSum / vendor.ratingCount : 0;
                return (
                  <Link
                    key={vendor.id}
                    href={`/vendor/${vendor.slug}`}
                    className="group"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        padding: "32px",
                        display: "flex",
                        alignItems: "center",
                        gap: "32px",
                        border: "1px solid var(--color-deep-charcoal)",
                        background: "var(--color-paper-ivory)",
                        transition: "background 0.2s ease",
                      }}
                      className="hover:bg-[var(--color-chai-cream)]"
                    >
                      <div className="display-xl" style={{ fontSize: "48px", lineHeight: 1, color: "var(--color-street-saffron)", minWidth: "64px" }}>
                        0{i + 1}
                      </div>
                      <div style={{ flexGrow: 1 }}>
                        <div className="headline-md" style={{ marginBottom: "4px", color: "var(--color-deep-charcoal)" }}>
                          {vendor.name}
                        </div>
                        <div className="body-md" style={{ color: "var(--color-on-surface-variant)" }}>
                          {vendor.speciality} · {vendor.locality}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", minWidth: "100px" }}>
                        <div className="headline-sm" style={{ color: "var(--color-deep-charcoal)", marginBottom: "4px" }}>
                          ★ {formatRating(vendor.ratingSum, vendor.ratingCount)}
                        </div>
                        <div className="label-caps" style={{ color: "var(--color-on-surface-variant)" }}>
                          {pluralize(vendor.ratingCount, "rating")}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ===================== DISCOVERY (CATEGORIES + LOCALITIES) ===================== */}
        <section style={{ marginBottom: "120px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "64px" }}>
            {/* Food Discovery */}
            <div>
              <SectionHeader title="By Food." subtitle="What are you craving?" href="/browse" hideLink />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--color-deep-charcoal)", border: "1px solid var(--color-deep-charcoal)" }}>
                {popularCategories.map((spec) => (
                  <Link
                    key={spec}
                    href={`/browse?speciality=${encodeURIComponent(spec)}`}
                    className="group"
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <div
                      className="bg-[var(--color-paper-ivory)] group-hover:bg-[var(--color-chai-cream)] transition-all duration-200"
                      style={{ padding: "24px 16px", height: "100%" }}
                    >
                      <div
                        className="headline-sm text-[var(--color-deep-charcoal)] group-hover:text-[var(--color-street-saffron)] transition-colors duration-200"
                        style={{ fontSize: "18px", lineHeight: 1.2 }}
                      >
                        {spec}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Locality Discovery */}
            <div>
              <SectionHeader title="By Locality." subtitle="Explore neighbourhoods." href="/browse" hideLink />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--color-deep-charcoal)", border: "1px solid var(--color-deep-charcoal)" }}>
                {popularLocalities.map((loc) => (
                  <Link
                    key={loc}
                    href={`/browse?locality=${encodeURIComponent(loc)}`}
                    className="group"
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <div
                      className="bg-[var(--color-paper-ivory)] group-hover:bg-[var(--color-chai-cream)] transition-all duration-200"
                      style={{ padding: "24px 16px", height: "100%" }}
                    >
                      <div
                        className="headline-sm text-[var(--color-deep-charcoal)] group-hover:text-[var(--color-street-saffron)] transition-colors duration-200"
                        style={{ fontSize: "18px", lineHeight: 1.2 }}
                      >
                        {loc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================== FEATURED ===================== */}
        {featuredVendors.length > 0 && (
          <section style={{ marginBottom: "120px" }}>
            <SectionHeader title="Editorial Picks." subtitle="Hand-selected by our team." href="/browse" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
                gap: "32px",
              }}
            >
              {featuredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} isEditorial />
              ))}
            </div>
          </section>
        )}

        {/* ===================== RECENTLY ADDED ===================== */}
        {recentVendors.length > 0 && (
          <section style={{ marginBottom: "120px", background: "var(--color-chai-cream)", margin: "0 -20px 120px -20px", padding: "80px 20px" }}>
            <div className="container-page" style={{ padding: 0 }}>
              <SectionHeader title="Just In." subtitle="Fresh discoveries from the community." href="/browse?sort=newest" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "24px",
                }}
              >
                {recentVendors.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} isCompact />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===================== CTA ===================== */}
        <section
          style={{
            padding: "80px 48px",
            background: "var(--color-deep-charcoal)",
            color: "var(--color-paper-ivory)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "48px",
            alignItems: "center",
          }}
        >
          <div>
            <h2 className="display-xl" style={{ color: "var(--color-paper-ivory)", marginBottom: "16px", fontSize: "56px" }}>
              Add your <br/><span style={{ color: "var(--color-street-saffron)" }}>Favourite</span>
            </h2>
          </div>
          <div>
            <p className="body-lg" style={{ marginBottom: "40px", color: "var(--color-surface-dim)", maxWidth: "400px" }}>
              Is your favourite spot missing? Help others discover it by adding it to the directory.
            </p>
            <Link href="/add" className="btn btn-lg" style={{ background: "var(--color-street-saffron)", color: "white", borderRadius: 0 }}>
              Submit a Vendor
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

// ===================== HELPERS =====================

function SectionHeader({
  title,
  subtitle,
  href,
  hideLink = false,
}: {
  title: string;
  subtitle: string;
  href: string;
  hideLink?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "48px",
        paddingBottom: "16px",
        borderBottom: "1px solid var(--color-deep-charcoal)",
        flexWrap: "wrap",
        gap: "16px",
      }}
    >
      <div>
        <h2 className="headline-lg">{title}</h2>
        <p className="body-lg" style={{ color: "var(--color-on-surface-variant)", marginTop: "8px" }}>{subtitle}</p>
      </div>
      {!hideLink && (
        <Link
          href={href}
          className="label-caps border border-[var(--color-deep-charcoal)] text-[var(--color-deep-charcoal)] hover:bg-[var(--color-deep-charcoal)] hover:text-[var(--color-paper-ivory)] transition-all duration-200"
          style={{
            textDecoration: "none",
            padding: "10px 20px",
          }}
        >
          View Directory
        </Link>
      )}
    </div>
  );
}

function VendorCard({
  vendor,
  isEditorial = false,
  isCompact = false,
}: {
  vendor: {
    id: string;
    slug: string;
    name: string;
    speciality: string;
    locality: string;
    ratingSum: number;
    ratingCount: number;
    isVerified: boolean;
    isFeatured?: boolean;
    primaryImage?: string;
  };
  isEditorial?: boolean;
  isCompact?: boolean;
}) {
  const avg = vendor.ratingCount > 0 ? vendor.ratingSum / vendor.ratingCount : 0;
  
  // "Why this place?" logic
  let signal = null;
  if (vendor.isFeatured) signal = "Editorial Pick";
  else if (vendor.ratingCount >= 5 && avg >= 4.5) signal = "Community Favourite";
  else if (vendor.ratingCount === 0) signal = "New Addition";
  else if (vendor.isVerified) signal = "Verified Vendor";

  return (
    <Link href={`/vendor/${vendor.slug}`} style={{ textDecoration: "none" }}>
      <div className="card hover:border-[var(--color-street-saffron)] transition-colors duration-300" style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-paper-ivory)" }}>
        {/* Image / Typographic Placeholder */}
        {!isCompact && (
          <div
            style={{
              height: isEditorial ? "320px" : "200px",
              borderBottom: "1px solid var(--color-deep-charcoal)",
              position: "relative",
              overflow: "hidden",
              background: vendor.primaryImage ? "var(--color-surface-dim)" : "var(--color-deep-charcoal)",
            }}
          >
            {vendor.primaryImage ? (
              <Image
                src={vendor.primaryImage}
                alt={vendor.name}
                fill
                style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                className="hover:scale-105"
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
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
          </div>
        )}

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
            📍 {vendor.locality}
          </div>

          {/* "Why this place?" Signal */}
          <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--border-default)" }}>
            <span className="label-caps" style={{ color: "var(--color-on-surface-variant)" }}>
              {signal ? signal : pluralize(vendor.ratingCount, "Community Log")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
