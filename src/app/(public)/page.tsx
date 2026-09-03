import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import {
  getFeaturedVendors,
  getTopRatedVendors,
  getRecentVendors,
  getSiteStats,
} from "@/services/vendor.server";
import { SPECIALITIES, LOCALITIES, SITE_CONFIG } from "@/constants";
import { getFoodImage, SPECIALITY_IMAGES } from "@/constants/food-images";
import { formatRating, pluralize } from "@/utils/format";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — Ahmedabad's Community Food Guide`,
  description: SITE_CONFIG.description,
};

export default async function HomePage() {
  const [stats, topVendors, featuredVendors] = await Promise.all([
    getSiteStats(),
    getTopRatedVendors(3),
    getFeaturedVendors(),
  ]);

  const recentVendorsRaw = await getRecentVendors(12);

  // Filter out featured vendors from recent vendors to avoid duplication
  const recentVendors = recentVendorsRaw
    .filter((v) => !featuredVendors.some((fv) => fv.id === v.id))
    .slice(0, 8);

  const popularCategories = SPECIALITIES.slice(0, 8);
  const popularLocalities = LOCALITIES.slice(0, 8);

  return (
    <div>
      {/* ===================== HERO ===================== */}
      <section style={{ position: "relative", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", margin: "0 -20px" }}>
        {/* Background Catalogue */}
        <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gridTemplateRows: "repeat(3, 1fr)", gap: "4px", zIndex: 0 }}>
          {Array.from(new Set(Object.values(SPECIALITY_IMAGES))).slice(0, 15).map((src, i) => (
            <div key={i} style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image src={src} alt="Food background" fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
          ))}
        </div>
        
        {/* Dark Overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(15, 15, 15, 0.8)", zIndex: 1 }} />
        
        {/* Content */}
        <div className="container-page" style={{ position: "relative", zIndex: 2, width: "100%", padding: "120px 20px", textAlign: "center" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              className="label-caps"
              style={{
                color: "var(--color-street-saffron)",
                marginBottom: "32px",
              }}
            >
              The City's Directory
            </div>

            <h1 className="display-xl" style={{ marginBottom: "24px", color: "var(--color-paper-ivory)" }}>
              Find your next <br />
              <span style={{ color: "rgba(249, 247, 242, 0.7)", fontStyle: "italic" }}>favourite spot.</span>
            </h1>

            <p className="body-lg" style={{ color: "rgba(249, 247, 242, 0.8)", marginBottom: "48px", maxWidth: "480px", marginInline: "auto" }}>
              Ahmedabad's street food, documented and rated by the people who live here.
            </p>

            {/* Discovery Search */}
            <form action="/browse" method="GET" style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "560px", marginBottom: "32px", marginInline: "auto" }}>
              <div style={{ position: "relative", flexGrow: 1 }}>
                <Search size={18} style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "var(--color-outline)" }} />
                <input 
                  name="search" 
                  placeholder="Search food, vendors or localities..." 
                  className="input" 
                  style={{ paddingLeft: "52px", height: "64px", fontSize: "16px", background: "var(--color-paper-ivory)", borderRadius: "32px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: "64px", padding: "0 32px", borderRadius: "32px", fontWeight: "700" }}>
                Search
              </button>
            </form>
            <div className="label-caps" style={{ color: "rgba(249, 247, 242, 0.8)", marginBottom: "32px", fontSize: "13px" }}>
              Popular searches: Dabeli, Manek Chowk, Law Garden
            </div>
            
            <Link href="/add" className="label-caps hover:text-[var(--color-street-saffron)] transition-colors duration-200" style={{ color: "rgba(249, 247, 242, 0.9)", textDecoration: "none" }}>
              + Or submit a vendor
            </Link>
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
                        padding: "24px 32px",
                        display: "flex",
                        alignItems: "center",
                        gap: "24px",
                        border: "1px solid var(--border-subtle)",
                        background: "var(--color-paper-ivory)",
                        borderRadius: "var(--radius-xl)",
                        boxShadow: "var(--shadow-sm)",
                        transition: "all 0.2s ease",
                      }}
                      className="hover:shadow-[var(--shadow)] hover:border-[var(--border-default)] hover:-translate-y-1"
                    >
                      <div className="display-xl" style={{ fontSize: "40px", lineHeight: 1, color: "var(--color-outline-variant)", minWidth: "56px", fontWeight: "800" }}>
                        0{i + 1}
                      </div>
                      
                      {/* Thumbnail Image */}
                      <div style={{ width: "64px", height: "64px", position: "relative", borderRadius: "var(--radius)", overflow: "hidden", flexShrink: 0 }}>
                        <Image
                          src={vendor.primaryImage || getFoodImage(vendor.speciality)}
                          alt={vendor.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="64px"
                        />
                      </div>

                      <div style={{ flexGrow: 1 }}>
                        <div className="headline-sm" style={{ marginBottom: "4px", color: "var(--color-deep-charcoal)", fontSize: "20px" }}>
                          {vendor.name}
                        </div>
                        <div className="body-md" style={{ color: "var(--color-on-surface-variant)", fontSize: "14px" }}>
                          {vendor.speciality} · {vendor.locality}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", minWidth: "120px" }}>
                        <div style={{ display: "inline-flex", background: "var(--color-law-garden-green)", color: "white", padding: "4px 8px", borderRadius: "6px", fontWeight: "700", fontSize: "14px", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                          {formatRating(vendor.ratingSum, vendor.ratingCount)} <span style={{ fontSize: "10px" }}>★</span>
                        </div>
                        <div className="label-caps" style={{ color: "var(--color-outline)", fontSize: "11px" }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "64px" }}>
            {/* Food Discovery */}
            <div>
              <SectionHeader title="Eat what makes you happy" subtitle="Explore by popular food categories" href="/browse" hideLink />
              <div style={{ display: "flex", gap: "24px", overflowX: "auto", paddingBottom: "16px", msOverflowStyle: "none", scrollbarWidth: "none" }}>
                {popularCategories.map((spec) => (
                  <Link
                    key={spec}
                    href={`/browse?speciality=${encodeURIComponent(spec)}`}
                    className="group"
                    style={{ textDecoration: "none", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "120px" }}
                  >
                    <div
                      className="transition-transform duration-300 group-hover:scale-105"
                      style={{ width: "120px", height: "120px", borderRadius: "50%", overflow: "hidden", position: "relative", boxShadow: "var(--shadow-sm)" }}
                    >
                      <Image
                        src={getFoodImage(spec)}
                        alt={spec}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="120px"
                      />
                    </div>
                    <div
                      className="label-md text-[var(--color-deep-charcoal)] group-hover:text-[var(--color-street-saffron)] transition-colors duration-200"
                      style={{ textAlign: "center", fontWeight: "600" }}
                    >
                      {spec}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Locality Discovery */}
            <div>
              <SectionHeader title="Explore Neighbourhoods" subtitle="Find the best street food near you" href="/browse" hideLink />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {popularLocalities.map((loc) => (
                  <Link
                    key={loc}
                    href={`/browse?locality=${encodeURIComponent(loc)}`}
                    className="group"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="bg-[var(--color-paper-ivory)] group-hover:bg-[var(--color-surface-dim)] group-hover:shadow-[var(--shadow-sm)] transition-all duration-200"
                      style={{ padding: "12px 24px", borderRadius: "9999px", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <MapPin size={16} className="text-[var(--color-street-saffron)]" />
                      <div
                        className="label-md text-[var(--color-deep-charcoal)]"
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

        {/* ===================== CTA ===================== */}
        <section
          style={{
            padding: "80px 48px",
            background: "var(--color-chai-cream)",
            color: "var(--color-deep-charcoal)",
            borderRadius: "var(--radius-xl)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "48px",
            alignItems: "center",
          }}
        >
          <div>
            <h2 className="headline-lg" style={{ color: "var(--color-deep-charcoal)", marginBottom: "16px", fontSize: "40px" }}>
              Know a place <br/><span style={{ color: "var(--color-street-saffron)" }}>worth eating at?</span>
            </h2>
          </div>
          <div>
            <p className="body-lg" style={{ marginBottom: "40px", color: "var(--color-on-surface-variant)", maxWidth: "400px" }}>
              Add a street-food vendor that Ahmedabad should know about.
            </p>
            <Link href="/add" className="btn btn-primary btn-lg" style={{ borderRadius: "var(--radius-full)" }}>
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
          className="label-caps bg-[var(--color-paper-ivory)] border border-[var(--border-default)] text-[var(--color-deep-charcoal)] hover:bg-[var(--color-surface-dim)] transition-all duration-200"
          style={{
            textDecoration: "none",
            padding: "10px 20px",
            borderRadius: "var(--radius-full)"
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
  
  let signal = null;
  if (vendor.isFeatured) signal = "Must Try";
  else if (vendor.ratingCount >= 5 && avg >= 4.5) signal = "Top Rated";
  else if (vendor.ratingCount === 0) signal = "New";
  else if (vendor.isVerified) signal = "Verified";

  return (
    <Link href={`/vendor/${vendor.slug}`} style={{ textDecoration: "none" }}>
      <div className="card hover:shadow-[var(--shadow)] transition-all duration-300" style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--color-paper-ivory)", borderRadius: "var(--radius-xl)" }}>
        {/* Image */}
        {!isCompact && (
          <div
            style={{
              height: isEditorial ? "280px" : "180px",
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
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              />
            ) : (
              <Image
                src={getFoodImage(vendor.speciality)}
                alt={vendor.speciality}
                fill
                style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
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
        )}

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
            {isCompact && avg > 0 && (
              <div style={{ background: avg >= 4.0 ? "var(--color-law-garden-green)" : "var(--color-street-saffron)", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "2px" }}>
                {avg.toFixed(1)} <span style={{ fontSize: "10px" }}>★</span>
              </div>
            )}
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
