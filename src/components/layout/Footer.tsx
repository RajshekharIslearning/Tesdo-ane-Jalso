import Link from "next/link";
import { ShoppingBag, Globe, Link as LinkIcon, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/constants";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-deep-charcoal)",
        marginTop: "5rem",
        paddingTop: "4rem",
        paddingBottom: "2rem",
        background: "var(--color-paper-ivory)",
      }}
    >
      <div className="container-page">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "3rem",
            marginBottom: "4rem",
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: "1 / -1", maxWidth: 400 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "var(--color-deep-charcoal)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingBag size={20} color="var(--color-paper-ivory)" />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "var(--color-deep-charcoal)",
                  letterSpacing: "-0.02em",
                }}
              >
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="body-md" style={{ color: "var(--color-on-surface-variant)", marginBottom: "1.5rem" }}>
              Community-powered platform to discover and rate the best street food vendors across Ahmedabad.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[
                { href: SITE_CONFIG.social.instagram, icon: <Globe size={18} /> },
                { href: SITE_CONFIG.social.twitter, icon: <LinkIcon size={18} /> },
                { href: `mailto:${SITE_CONFIG.email}`, icon: <Mail size={18} /> },
              ].map(({ href, icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 40,
                    height: 40,
                    background: "var(--color-surface)",
                    border: "1px solid var(--border-default)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-deep-charcoal)",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                  className="hover:bg-[var(--color-street-saffron)] hover:text-white hover:border-[var(--color-street-saffron)]"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <div className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginBottom: "1rem" }}>
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
            <div className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginBottom: "1rem" }}>
              Company
            </div>
            {[
              { href: "/report", label: "Report Content" },
            ].map(({ href, label }) => (
              <FooterLink key={href} href={href}>{label}</FooterLink>
            ))}
          </div>

          {/* Legal */}
          <div>
            <div className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginBottom: "1rem" }}>
              Legal
            </div>
            {[
              { href: "/", label: "Terms of Service" },
            ].map(({ href, label }) => (
              <FooterLink key={href} href={href}>{label}</FooterLink>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-default)",
            paddingTop: "2rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <p className="body-md" style={{ fontSize: "14px", color: "var(--color-on-surface-variant)" }}>
            © {new Date().getFullYear()} {SITE_CONFIG.name}.
          </p>
          <p className="body-md" style={{ fontSize: "14px", color: "var(--color-on-surface-variant)" }}>
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
        fontFamily: "var(--font-sans)",
        fontSize: "16px",
        color: "var(--color-deep-charcoal)",
        textDecoration: "none",
        marginBottom: "0.75rem",
        transition: "color 0.15s ease",
      }}
      className="hover:text-[var(--color-street-saffron)]"
    >
      {children}
    </Link>
  );
}
