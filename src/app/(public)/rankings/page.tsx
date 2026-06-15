import type { Metadata } from "next";
import Link from "next/link";
import { getLocalityRankings } from "@/services/vendor.server";
import { SPECIALITY_EMOJIS } from "@/constants";

export const metadata: Metadata = {
  title: "Locality Rankings",
  description: "See which neighbourhoods in Ahmedabad have the best-rated street food vendors, ranked by community ratings.",
};

export default async function RankingsPage() {
  const rankings = await getLocalityRankings();

  return (
    <div className="container-page" style={{ paddingTop: "2rem", paddingBottom: "5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
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
          🗺️ Locality Rankings
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
          Neighbourhoods ranked by average vendor rating from the community
        </p>
      </div>

      {rankings.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 2rem",
            background: "var(--surface-raised)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 16,
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
            No data yet
          </h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            Add vendors and rate them to see locality rankings!
          </p>
          <Link href="/add" className="btn btn-primary">➕ Add a Vendor</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {rankings.map((r, i) => {
            const medals = ["🥇", "🥈", "🥉"];
            const medalColors = ["oklch(0.82 0.16 82)", "oklch(0.65 0.01 82)", "oklch(0.60 0.07 52)"];
            const isTop3 = i < 3;

            return (
              <div
                key={r.locality}
                className="card"
                style={{
                  padding: "1.25rem 1.5rem",
                  border: isTop3
                    ? `1px solid ${["oklch(0.82 0.16 82 / 0.4)", "oklch(0.65 0.01 82 / 0.3)", "oklch(0.60 0.07 52 / 0.3)"][i]}`
                    : undefined,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {/* Rank badge */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: isTop3 ? "1.25rem" : "0.9375rem",
                      flexShrink: 0,
                      background: isTop3 ? `${medalColors[i]}22` : "var(--surface-subtle)",
                      color: isTop3 ? medalColors[i] : "var(--text-muted)",
                    }}
                  >
                    {isTop3 ? medals[i] : i + 1}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div>
                        <h2
                          style={{
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "var(--text-primary)",
                            marginBottom: "0.125rem",
                          }}
                        >
                          {r.locality}
                        </h2>
                        <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                          {r.vendorCount} vendor{r.vendorCount !== 1 ? "s" : ""} ·{" "}
                          {r.totalRatings} rating{r.totalRatings !== 1 ? "s" : ""}
                        </div>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div
                          style={{
                            fontSize: "1.375rem",
                            fontWeight: 800,
                            color: r.averageRating > 0 ? "var(--gold)" : "var(--text-muted)",
                            lineHeight: 1,
                          }}
                        >
                          {r.averageRating > 0 ? r.averageRating.toFixed(1) : "—"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>avg rating</div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {r.averageRating > 0 && (
                      <div className="progress-bar" style={{ marginTop: "0.625rem" }}>
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${(r.averageRating / 5) * 100}%` }}
                        />
                      </div>
                    )}

                    {/* Top vendors for this locality */}
                    {r.topVendors.length > 0 && (
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                        {r.topVendors.map((v) => (
                          <Link
                            key={v.id}
                            href={`/vendor/${v.slug}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontSize: "0.75rem",
                              color: "var(--text-secondary)",
                              background: "var(--surface-overlay)",
                              border: "1px solid var(--border-subtle)",
                              padding: "0.2rem 0.5rem",
                              borderRadius: 99,
                              textDecoration: "none",
                              transition: "all 0.15s ease",
                            }}
                            className="hover:border-[oklch(0.70_0.19_55/0.4)] hover:text-[var(--brand-light)]"
                          >
                            {SPECIALITY_EMOJIS[v.speciality] ?? "🍴"} {v.name}
                            {v.ratingCount > 0 && (
                              <span style={{ color: "var(--gold)" }}>
                                ★ {(v.ratingSum / v.ratingCount).toFixed(1)}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
