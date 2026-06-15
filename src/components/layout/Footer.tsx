import Link from "next/link";
import { ShoppingBag, Globe, Link as LinkIcon, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/constants";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-subtle)",
        marginTop: "5rem",
        paddingTop: "3rem",
        paddingBottom: "2rem",
        background: "var(--surface-raised)",
      }}
    >
      <div className="container-page">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, oklch(0.68 0.20 42), oklch(0.76 0.17 55))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingBag size={16} color="#fff" />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  color: "var(--text-primary)",
                }}
              >
                {SITE_CONFIG.name}
              </span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 240 }}>
              Community-powered platform to discover and rate the best street food vendors across Ahmedabad.
            </p>
            <div style={{ display: "flex", gap: "0.625rem", marginTop: "1rem" }}>
              {[
                { href: SITE_CONFIG.social.instagram, icon: <Globe size={16} /> },
                { href: SITE_CONFIG.social.twitter, icon: <LinkIcon size={16} /> },
                { href: `mailto:${SITE_CONFIG.email}`, icon: <Mail size={16} /> },
              ].map(({ href, icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "var(--surface-overlay)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--brand-light)";
                    (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.70 0.19 55 / 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Explore
            </div>
            {[
              { href: "/browse", label: "Browse Vendors" },
              { href: "/rankings", label: "Locality Rankings" },
              { href: "/add", label: "Add a Vendor" },
            ].map(({ href, label }) => (
              <FooterLink key={href} href={href}>{label}</FooterLink>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Company
            </div>
            {[
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
              { href: "/faq", label: "FAQ" },
              { href: "/report", label: "Report Content" },
            ].map(({ href, label }) => (
              <FooterLink key={href} href={href}>{label}</FooterLink>
            ))}
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Legal
            </div>
            {[
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Service" },
            ].map(({ href, label }) => (
              <FooterLink key={href} href={href}>{label}</FooterLink>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. Community powered · No signup required.
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Ratings are anonymous and one-per-user per vendor.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        fontSize: "0.875rem",
        color: "var(--text-secondary)",
        textDecoration: "none",
        marginBottom: "0.375rem",
        transition: "color 0.15s ease",
      }}
      onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--brand-light)"; }}
      onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--text-secondary)"; }}
    >
      {children}
    </Link>
  );
}
