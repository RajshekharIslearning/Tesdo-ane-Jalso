import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getVendorBySlug } from "@/services/vendor.server";
import { SITE_CONFIG } from "@/constants";
import { formatRelative, pluralize } from "@/utils/format";
import RatingSection from "./RatingSection";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);
  if (!vendor) return { title: "Vendor Not Found" };

  const avg = vendor.ratingCount > 0 ? (vendor.ratingSum / vendor.ratingCount).toFixed(1) : null;
  const title = `${vendor.name} — ${vendor.speciality} in ${vendor.locality}`;
  const description = vendor.description
    ?? `${vendor.name} serves ${vendor.speciality} in ${vendor.locality}, Ahmedabad. ${avg ? `Rated ${avg}/5 by ${vendor.ratingCount} people.` : "Be the first to rate!"}`;

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

      <div className="container-page" style={{ paddingTop: "40px", paddingBottom: "120px" }}>
        {/* Breadcrumb */}
        <div className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginBottom: "32px", paddingBottom: "16px", borderBottom: "1px solid var(--color-deep-charcoal)" }}>
          <Link href="/" style={{ color: "var(--color-on-surface-variant)", textDecoration: "none", transition: "color 0.2s" }} className="hover:text-[var(--color-deep-charcoal)]">Home</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <Link href="/browse" style={{ color: "var(--color-on-surface-variant)", textDecoration: "none", transition: "color 0.2s" }} className="hover:text-[var(--color-deep-charcoal)]">Directory</Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "var(--color-deep-charcoal)" }}>{vendor.name}</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr min(400px, 35%)",
            gap: "48px",
            alignItems: "start",
          }}
          className="vendor-detail-grid"
        >
          {/* LEFT COLUMN */}
          <div>
            {/* Image Gallery */}
            <div
              style={{
                border: "1px solid var(--color-deep-charcoal)",
                overflow: "hidden",
                background: "var(--color-chai-cream)",
                marginBottom: "32px",
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
                  }}
                >
                  <div className="display-xl" style={{ fontSize: "80px", color: "var(--color-deep-charcoal)", opacity: 0.08, lineHeight: 1 }}>
                    {vendor.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail row */}
            {vendor.images.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "48px",
                  overflowX: "auto",
                }}
                className="no-scrollbar"
              >
                {vendor.images.map((img) => (
                  <div
                    key={img.id}
                    style={{
                      width: 96,
                      height: 72,
                      overflow: "hidden",
                      flexShrink: 0,
                      position: "relative",
                      border: img.isPrimary ? "2px solid var(--color-deep-charcoal)" : "1px solid var(--color-deep-charcoal)",
                      background: "var(--color-surface-dim)"
                    }}
                  >
                    <Image src={img.url} alt={img.caption ?? vendor.name} fill style={{ objectFit: "cover" }} sizes="96px" />
                  </div>
                ))}
              </div>
            )}

            {/* Vendor Info — H1 first for correct hierarchy */}
            <div style={{ marginBottom: "64px" }}>
              <h1 className="display-xl" style={{ marginBottom: "20px" }}>
                {vendor.name}
              </h1>

              {/* Tags below the name */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "24px" }}>
                <span className="label-caps" style={{ border: "1px solid var(--color-deep-charcoal)", padding: "6px 12px", background: "var(--color-paper-ivory)" }}>{vendor.speciality}</span>
                <span className="label-caps" style={{ border: "1px solid var(--color-deep-charcoal)", padding: "6px 12px", background: "var(--color-paper-ivory)" }}>{vendor.locality}</span>
                {vendor.isVerified && <span className="label-caps" style={{ border: "1px solid var(--color-law-garden-green)", padding: "6px 12px", background: "var(--color-law-garden-green)", color: "white" }}>Verified</span>}
                {vendor.isFeatured && <span className="label-caps" style={{ border: "1px solid var(--color-deep-charcoal)", padding: "6px 12px", background: "var(--color-deep-charcoal)", color: "var(--color-paper-ivory)" }}>Featured</span>}
              </div>

              {vendor.address && (
                <p className="body-md" style={{ color: "var(--color-on-surface-variant)", marginBottom: "24px" }}>
                  {vendor.address}, {vendor.locality}, Ahmedabad
                </p>
              )}

              {vendor.description && (
                <p className="body-lg" style={{ color: "var(--color-deep-charcoal)", lineHeight: 1.6, marginTop: "24px" }}>
                  {vendor.description}
                </p>
              )}

              <p className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--color-deep-charcoal)" }}>
                Listed {formatRelative(vendor.createdAt)}
              </p>
            </div>

            {/* Ratings */}
            <div>
              <h2 className="headline-lg" style={{ marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--color-deep-charcoal)" }}>
                {pluralize(vendor.ratingCount, "Rating")}
              </h2>
              {vendor.ratings.length === 0 ? (
                <div
                  style={{
                    padding: "48px 24px",
                    background: "var(--color-paper-ivory)",
                    border: "1px solid var(--color-deep-charcoal)",
                    textAlign: "center",
                  }}
                >
                  <p className="body-lg" style={{ color: "var(--color-on-surface-variant)" }}>
                    No ratings yet. Be the first.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {vendor.ratings.map((rating) => (
                    <div
                      key={rating.id}
                      style={{ padding: "24px", border: "1px solid var(--color-deep-charcoal)", background: "var(--color-paper-ivory)" }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                        <div style={{ display: "flex", gap: "4px" }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} style={{ color: s <= rating.stars ? "var(--color-street-saffron)" : "var(--color-surface-dim)", fontSize: "20px" }}>★</span>
                          ))}
                        </div>
                        <span className="label-caps" style={{ color: "var(--color-on-surface-variant)" }}>{formatRelative(rating.createdAt)}</span>
                      </div>
                      {rating.comment && (
                        <p className="body-md" style={{ color: "var(--color-deep-charcoal)", lineHeight: 1.6 }}>{rating.comment}</p>
                      )}
                      <p className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--color-deep-charcoal)" }}>
                        — {(rating as { user?: { name?: string | null } | null }).user?.name ?? "Anonymous"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Report link */}
            <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid var(--color-deep-charcoal)" }}>
              <Link
                href={`/report?vendorId=${vendor.id}&vendorName=${encodeURIComponent(vendor.name)}`}
                className="label-caps"
                style={{ color: "var(--color-on-surface-variant)", textDecoration: "none" }}
              >
                Report this vendor
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN — Rating panel */}
          <div style={{ position: "sticky", top: 120 }}>
            {/* Rating summary */}
            <div
              style={{ padding: "32px", marginBottom: "24px", border: "1px solid var(--color-deep-charcoal)", background: "var(--color-paper-ivory)" }}
            >
              <div style={{ textAlign: "center", marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid var(--color-deep-charcoal)" }}>
                <div
                  className="display-xl"
                  style={{
                    fontSize: "80px",
                    color: avg > 0 ? "var(--color-street-saffron)" : "var(--color-on-surface-variant)",
                    lineHeight: 1,
                    marginBottom: "16px",
                  }}
                >
                  {avg > 0 ? avg.toFixed(1) : "—"}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "4px", marginBottom: "16px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} style={{ fontSize: "24px", color: s <= Math.round(avg) ? "var(--color-street-saffron)" : "var(--color-surface-dim)" }}>★</span>
                  ))}
                </div>
                <div className="label-caps" style={{ color: "var(--color-on-surface-variant)" }}>
                  {pluralize(vendor.ratingCount, "rating")}
                </div>
              </div>

              {/* Rating distribution */}
              {vendor.ratingCount > 0 && (
                <div>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = vendor.ratings.filter((r) => r.stars === star).length;
                    const pct = vendor.ratingCount > 0 ? (count / vendor.ratingCount) * 100 : 0;
                    return (
                      <div key={star} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                        <span className="label-caps" style={{ color: "var(--color-on-surface-variant)", width: 16, textAlign: "right" }}>{star}</span>
                        <span style={{ color: "var(--color-street-saffron)", fontSize: "16px" }}>★</span>
                        <div style={{ flex: 1, height: "4px", background: "var(--color-surface-dim)" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: "var(--color-deep-charcoal)" }} />
                        </div>
                        <span className="label-caps" style={{ color: "var(--color-on-surface-variant)", width: 24, textAlign: "right" }}>{count}</span>
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
