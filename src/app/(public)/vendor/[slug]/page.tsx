import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getVendorBySlug } from "@/services/vendor.server";
import { SPECIALITY_EMOJIS, SITE_CONFIG } from "@/constants";
import { formatRelative, formatDate } from "@/utils/format";
import RatingSection from "./RatingSection";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);
  if (!vendor) return { title: "Vendor Not Found" };

  const avg = vendor.ratingCount > 0 ? (vendor.ratingSum / vendor.ratingCount).toFixed(1) : null;
  const title = `${vendor.name} — ${vendor.speciality} in ${vendor.locality}`;
  const description = vendor.description
    ?? `${vendor.name} serves ${vendor.speciality} in ${vendor.locality}, Ahmedabad. ${avg ? `Rated ${avg}/5 by ${vendor.ratingCount} community members.` : "Be the first to rate!"}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_CONFIG.url}/vendor/${slug}`,
      images: vendor.images[0] ? [{ url: vendor.images[0].url, width: 800, height: 600, alt: vendor.name }] : [],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function VendorDetailPage({ params }: Props) {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);
  if (!vendor) notFound();

  const avg = vendor.ratingCount > 0 ? vendor.ratingSum / vendor.ratingCount : 0;
  const primaryImage = vendor.images.find((i) => i.isPrimary) ?? vendor.images[0];

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: vendor.name,
    description: vendor.description ?? `${vendor.name} — ${vendor.speciality} in ${vendor.locality}, Ahmedabad`,
    address: {
      "@type": "PostalAddress",
      addressLocality: vendor.locality,
      addressRegion: "Gujarat",
      addressCountry: "IN",
      streetAddress: vendor.address ?? undefined,
    },
    aggregateRating: vendor.ratingCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: avg.toFixed(1),
      reviewCount: vendor.ratingCount,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    servesCuisine: vendor.speciality,
    image: primaryImage?.url,
    url: `${SITE_CONFIG.url}/vendor/${vendor.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-page" style={{ paddingTop: "2rem", paddingBottom: "5rem" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
          {" / "}
          <Link href="/browse" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Browse</Link>
          {" / "}
          <span style={{ color: "var(--text-secondary)" }}>{vendor.name}</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr min(400px, 35%)",
            gap: "2rem",
            alignItems: "start",
          }}
          className="vendor-detail-grid"
        >
          {/* LEFT COLUMN */}
          <div>
            {/* Image Gallery */}
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                background: "var(--surface-subtle)",
                marginBottom: "2rem",
                aspectRatio: "16/9",
                position: "relative",
              }}
            >
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={vendor.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "6rem",
                  }}
                >
                  {SPECIALITY_EMOJIS[vendor.speciality] ?? "🍴"}
                </div>
              )}
            </div>

            {/* Thumbnail row */}
            {vendor.images.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "2rem",
                  overflowX: "auto",
                }}
                className="no-scrollbar"
              >
                {vendor.images.map((img) => (
                  <div
                    key={img.id}
                    style={{
                      width: 72,
                      height: 54,
                      borderRadius: 8,
                      overflow: "hidden",
                      flexShrink: 0,
                      position: "relative",
                      border: img.isPrimary ? "2px solid var(--brand)" : "2px solid var(--border-subtle)",
                    }}
                  >
                    <Image src={img.url} alt={img.caption ?? vendor.name} fill style={{ objectFit: "cover" }} sizes="72px" />
                  </div>
                ))}
              </div>
            )}

            {/* Vendor Info */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
                <span className="badge badge-brand">{SPECIALITY_EMOJIS[vendor.speciality] ?? "🍴"} {vendor.speciality}</span>
                <span className="badge badge-subtle">📍 {vendor.locality}</span>
                {vendor.isVerified && <span className="badge badge-jade">✓ Verified</span>}
                {vendor.isFeatured && <span className="badge badge-gold">⭐ Featured</span>}
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                  marginBottom: "0.5rem",
                }}
              >
                {vendor.name}
              </h1>

              {vendor.address && (
                <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                  📍 {vendor.address}, {vendor.locality}, Ahmedabad
                </p>
              )}

              {vendor.description && (
                <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.65, marginTop: "0.75rem" }}>
                  {vendor.description}
                </p>
              )}

              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
                Listed {formatRelative(vendor.createdAt)}
              </p>
            </div>

            {/* Reviews */}
            <div>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem", letterSpacing: "-0.01em" }}>
                Community Reviews ({vendor.ratingCount})
              </h2>
              {vendor.ratings.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2.5rem",
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 12,
                  }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🌟</div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
                    No reviews yet. Be the first to rate this vendor!
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {vendor.ratings.map((rating) => (
                    <div
                      key={rating.id}
                      className="card"
                      style={{ padding: "1rem 1.25rem" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.375rem" }}>
                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} style={{ color: s <= rating.stars ? "var(--gold)" : "var(--surface-subtle)", fontSize: "0.9rem" }}>★</span>
                          ))}
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatRelative(rating.createdAt)}</span>
                      </div>
                      {rating.comment && (
                        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{rating.comment}</p>
                      )}
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                        {(rating as { user?: { name?: string | null } | null }).user?.name ?? "Anonymous"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Report link */}
            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-subtle)" }}>
              <Link
                href={`/report?vendorId=${vendor.id}&vendorName=${encodeURIComponent(vendor.name)}`}
                style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textDecoration: "none" }}
              >
                ⚑ Report this vendor
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN — Rating panel */}
          <div style={{ position: "sticky", top: 80 }}>
            {/* Rating summary */}
            <div
              className="card"
              style={{ padding: "1.5rem", marginBottom: "1rem" }}
            >
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "3rem",
                    fontWeight: 800,
                    color: avg > 0 ? "var(--gold)" : "var(--text-muted)",
                    lineHeight: 1,
                    marginBottom: "0.25rem",
                  }}
                >
                  {avg > 0 ? avg.toFixed(1) : "—"}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "0.2rem", marginBottom: "0.375rem" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} style={{ fontSize: "1.25rem", color: s <= Math.round(avg) ? "var(--gold)" : "var(--surface-subtle)" }}>★</span>
                  ))}
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  {vendor.ratingCount} rating{vendor.ratingCount !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Rating distribution */}
              {vendor.ratingCount > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = vendor.ratings.filter((r) => r.stars === star).length;
                    const pct = vendor.ratingCount > 0 ? (count / vendor.ratingCount) * 100 : 0;
                    return (
                      <div key={star} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", width: 16, textAlign: "right" }}>{star}</span>
                        <span style={{ color: "var(--gold)", fontSize: "0.75rem" }}>★</span>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", width: 20 }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Rate this vendor */}
            <RatingSection vendorId={vendor.id} vendorName={vendor.name} />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .vendor-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
