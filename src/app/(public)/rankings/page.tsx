import type { Metadata } from "next";
import Link from "next/link";
import { getLocalityRankings } from "@/services/vendor.server";
import { pluralize } from "@/utils/format";

export const metadata: Metadata = {
  title: "Locality Rankings",
  description: "See which neighbourhoods in Ahmedabad have the best-rated street food vendors, ranked by community ratings.",
};

export default async function RankingsPage() {
  const rankings = await getLocalityRankings();

  return (
    <div className="container-page" style={{ paddingTop: "64px", paddingBottom: "120px" }}>
      {/* Header */}
      <div style={{ marginBottom: "64px", borderBottom: "1px solid var(--color-deep-charcoal)", paddingBottom: "24px" }}>
        <h1 className="display-xl" style={{ marginBottom: "16px" }}>
          Locality Rankings.
        </h1>
        <p className="body-lg" style={{ color: "var(--color-on-surface-variant)", maxWidth: "600px" }}>
          Ranked by average community rating.
        </p>
      </div>

      {rankings.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 32px",
            background: "var(--color-paper-ivory)",
            border: "1px solid var(--color-deep-charcoal)",
          }}
        >
          <p className="body-lg" style={{ color: "var(--color-on-surface-variant)", marginBottom: "32px" }}>
            No data yet. Add vendors and rate them to see locality rankings.
          </p>
          <Link href="/add" className="btn btn-primary btn-lg">
            Add a Vendor
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {rankings.map((r, i) => {
              const isTop3 = i < 3;
              const rankLabel = String(i + 1).padStart(2, "0");

              return (
                <div
                  key={r.locality}
                  style={{
                    padding: "28px 32px",
                    display: "flex",
                    alignItems: "center",
                    gap: "32px",
                    border: "1px solid var(--color-deep-charcoal)",
                    borderTop: i === 0 ? "1px solid var(--color-deep-charcoal)" : "none",
                    background: "var(--color-paper-ivory)",
                    transition: "background 0.2s ease",
                  }}
                  className="hover:bg-[var(--color-chai-cream)]"
                >
                  {/* Rank number */}
                  <div
                    className="display-xl"
                    style={{
                      fontSize: "40px",
                      lineHeight: 1,
                      color: isTop3 ? "var(--color-street-saffron)" : "var(--color-surface-dim)",
                      minWidth: "56px",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {rankLabel}
                  </div>

                  {/* Locality info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2
                      className="headline-sm"
                      style={{
                        color: "var(--color-deep-charcoal)",
                        marginBottom: "6px",
                      }}
                    >
                      {r.locality}
                    </h2>
                    <div className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginBottom: r.topVendors.length > 0 ? "12px" : "0" }}>
                      {pluralize(r.vendorCount, "vendor")} · {pluralize(r.totalRatings, "rating")}
                    </div>

                    {/* Top vendors */}
                    {r.topVendors.length > 0 && (
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {r.topVendors.map((v) => (
                          <Link
                            key={v.id}
                            href={`/vendor/${v.slug}`}
                            className="label-caps hover:text-[var(--color-street-saffron)] transition-colors duration-200"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              color: "var(--color-on-surface-variant)",
                              border: "1px solid var(--border-default)",
                              padding: "4px 10px",
                              textDecoration: "none",
                              background: "var(--color-surface)",
                            }}
                          >
                            {v.name}
                            {v.ratingCount > 0 && (
                              <span style={{ color: "var(--color-street-saffron)" }}>
                                ★ {(v.ratingSum / v.ratingCount).toFixed(1)}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div style={{ textAlign: "right", flexShrink: 0, minWidth: "80px" }}>
                    <div
                      className="headline-sm"
                      style={{
                        color: r.averageRating > 0 ? "var(--color-deep-charcoal)" : "var(--color-surface-dim)",
                        marginBottom: "4px",
                      }}
                    >
                      {r.averageRating > 0 ? (
                        <>★ {r.averageRating.toFixed(1)}</>
                      ) : (
                        "—"
                      )}
                    </div>
                    {r.averageRating > 0 && (
                      <div className="label-caps" style={{ color: "var(--color-on-surface-variant)" }}>
                        avg rating
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div style={{ marginTop: "64px", paddingTop: "32px", borderTop: "1px solid var(--color-deep-charcoal)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <p className="body-md" style={{ color: "var(--color-on-surface-variant)" }}>
              Rankings update as new ratings come in.
            </p>
            <Link href="/browse" className="label-caps btn btn-secondary" style={{ padding: "10px 24px" }}>
              Browse vendors
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
