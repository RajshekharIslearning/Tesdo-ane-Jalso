import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getFeaturedVendors,
  getTopRatedVendors,
  getRecentVendors,
  getSiteStats,
} from "@/services/vendor.server";
import { SPECIALITIES, SPECIALITY_EMOJIS, SITE_CONFIG } from "@/constants";
import { formatRating } from "@/utils/format";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — Discover Ahmedabad's Best Street Food`,
  description: SITE_CONFIG.description,
};

export default async function HomePage() {
  const [stats, topVendors, featuredVendors, recentVendors] = await Promise.all([
    getSiteStats(),
    getTopRatedVendors(3),
    getFeaturedVendors(),
    getRecentVendors(4),
  ]);

  const popularCategories = SPECIALITIES.slice(0, 12);

  return (
    <div>
      {/* ===================== HERO ===================== */}
      <section className="gradient-hero" style={{ padding: "4rem 0 5rem", textAlign: "center" }}>
        <div className="container-page">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.375rem 1rem",
              background: "oklch(0.70 0.19 55 / 0.12)",
              border: "1px solid oklch(0.70 0.19 55 / 0.25)",
              borderRadius: 99,
              fontSize: "0.8125rem",
              color: "var(--brand-light)",
              fontWeight: 500,
              marginBottom: "1.5rem",
            }}
          >
            🛒 Community-powered food discovery
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "var(--text-primary)",
              marginBottom: "1.25rem",
            }}
          >
            Discover Ahmedabad's{" "}
            <span className="text-gradient">Best Street Food</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              color: "var(--text-secondary)",
              maxWidth: 560,
              margin: "0 auto 2.5rem",
              lineHeight: 1.65,
            }}
          >
            Rate vendors, explore localities, and help your community find the most delicious street eats across {stats.totalLocalities} neighbourhoods.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/browse" className="btn btn-primary btn-lg" style={{ flex: "1 1 auto", maxWidth: 220 }}>
              🔍 Browse Vendors
            </Link>
            <Link href="/add" className="btn btn-secondary btn-lg" style={{ flex: "1 1 auto", maxWidth: 220 }}>
              ➕ Add a Vendor
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "2.5rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "3.5rem",
            }}
          >
            {[
              { val: stats.totalVendors, label: "Vendors Listed" },
              { val: stats.totalLocalities, label: "Localities Covered" },
              { val: stats.totalRatings, label: "Community Ratings" },
            ].map(({ val, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                  }}
                >
                  {val.toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: 2 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page" style={{ paddingTop: "3rem", paddingBottom: "4rem" }}>

        {/* ===================== TOP RATED ===================== */}
        {topVendors.length > 0 && (
          <section style={{ marginBottom: "4rem" }}>
            <SectionHeader title="🏆 Top Rated Vendors" subtitle="Highest community-rated picks right now" href="/browse?sort=rating" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1rem",
              }}
            >
              {topVendors.map((vendor, i) => {
                const medals = ["🥇", "🥈", "🥉"];
                const medalColors = ["var(--gold)", "#C0C0C0", "#CD7F32"];
                return (
                  <Link
                    key={vendor.id}
                    href={`/vendor/${vendor.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="card card-glow"
                      style={{
                        padding: "1.25rem 1.5rem",
                        position: "relative",
                        overflow: "hidden",
                        cursor: "pointer",
                        border: i === 0 ? "1px solid oklch(0.82 0.16 82 / 0.4)" : undefined,
                      }}
                    >
                      {i === 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 2,
                            background: "linear-gradient(90deg, var(--gold), oklch(0.70 0.19 55))",
                          }}
                        />
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                        <div style={{ fontSize: "1.75rem", lineHeight: 1 }}>{medals[i]}</div>
                        <div
                          style={{
                            background: "oklch(0.82 0.16 82 / 0.1)",
                            border: "1px solid oklch(0.82 0.16 82 / 0.25)",
                            borderRadius: 8,
                            padding: "0.25rem 0.625rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.9375rem",
                            fontWeight: 700,
                            color: medalColors[i],
                          }}
                        >
                          ★ {formatRating(vendor.ratingSum, vendor.ratingCount)}
                        </div>
                      </div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "1rem",
                          color: "var(--text-primary)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {vendor.name}
                      </div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                        {SPECIALITY_EMOJIS[vendor.speciality] ?? "🍴"} {vendor.speciality}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.5rem" }}>
                        <span className="badge badge-subtle" style={{ fontSize: "0.75rem" }}>
                          📍 {vendor.locality}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {vendor.ratingCount} ratings
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ===================== FEATURED ===================== */}
        {featuredVendors.length > 0 && (
          <section style={{ marginBottom: "4rem" }}>
            <SectionHeader title="⭐ Featured Vendors" subtitle="Hand-picked community favourites" href="/browse" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1rem",
              }}
            >
              {featuredVendors.map((vendor) => (
                <VendorMiniCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </section>
        )}

        {/* ===================== CATEGORIES ===================== */}
        <section style={{ marginBottom: "4rem" }}>
          <SectionHeader title="🍽️ Browse by Category" subtitle="What are you craving today?" href="/browse" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {popularCategories.map((spec) => (
              <Link
                key={spec}
                href={`/browse?speciality=${encodeURIComponent(spec)}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card hover:border-[oklch(0.70_0.19_55/0.4)] hover:bg-[oklch(0.70_0.19_55/0.06)]"
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
                    {SPECIALITY_EMOJIS[spec] ?? "🍴"}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                      lineHeight: 1.3,
                    }}
                  >
                    {spec}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===================== RECENTLY ADDED ===================== */}
        {recentVendors.length > 0 && (
          <section style={{ marginBottom: "4rem" }}>
            <SectionHeader title="🆕 Recently Added" subtitle="New vendors the community is excited about" href="/browse?sort=newest" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1rem",
              }}
            >
              {recentVendors.map((vendor) => (
                <VendorMiniCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </section>
        )}

        {/* ===================== CTA ===================== */}
        <section
          style={{
            borderRadius: 20,
            padding: "3rem 2rem",
            textAlign: "center",
            background: "linear-gradient(135deg, oklch(0.68 0.20 42 / 0.12), oklch(0.82 0.16 82 / 0.08))",
            border: "1px solid oklch(0.70 0.19 55 / 0.2)",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🛺</div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "0.75rem",
              letterSpacing: "-0.02em",
            }}
          >
            Know a Great Vendor?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "1.75rem",
              fontSize: "1rem",
              maxWidth: 440,
              margin: "0 auto 1.75rem",
              lineHeight: 1.6,
            }}
          >
            Help the community discover amazing local street food. No account needed — just share the love!
          </p>
          <Link href="/add" className="btn btn-primary btn-lg">
            ➕ Add a Vendor for Free
          </Link>
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
}: {
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "1.25rem",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "0.25rem",
          }}
        >
          {title}
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{subtitle}</p>
      </div>
      <Link
        href={href}
        style={{
          fontSize: "0.8125rem",
          color: "var(--brand-light)",
          textDecoration: "none",
          fontWeight: 500,
          flexShrink: 0,
        }}
      >
        View all →
      </Link>
    </div>
  );
}

function VendorMiniCard({
  vendor,
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
    primaryImage?: string;
  };
}) {
  const avg = vendor.ratingCount > 0 ? vendor.ratingSum / vendor.ratingCount : 0;

  return (
    <Link href={`/vendor/${vendor.slug}`} style={{ textDecoration: "none" }}>
      <div className="card card-glow" style={{ overflow: "hidden", cursor: "pointer" }}>
        {/* Image */}
        <div
          style={{
            height: 140,
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
              style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
              }}
            >
              {SPECIALITY_EMOJIS[vendor.speciality] ?? "🍴"}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "0.875rem 1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "0.375rem",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: "var(--text-primary)",
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {vendor.name}
              {vendor.isVerified && (
                <span style={{ marginLeft: "0.25rem", color: "var(--jade)", fontSize: "0.75rem" }}>✓</span>
              )}
            </div>
            {avg > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.2rem",
                  flexShrink: 0,
                  marginLeft: "0.5rem",
                }}
              >
                <span style={{ color: "var(--gold)", fontSize: "0.875rem" }}>★</span>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--gold)" }}>
                  {avg.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
            {SPECIALITY_EMOJIS[vendor.speciality] ?? "🍴"} {vendor.speciality}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="badge badge-subtle" style={{ fontSize: "0.6875rem" }}>
              📍 {vendor.locality}
            </span>
            {vendor.ratingCount > 0 && (
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {vendor.ratingCount} rating{vendor.ratingCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
