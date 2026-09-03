"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/rankings", label: "Rankings" },
  { href: "/add", label: "Add Vendor" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
        background: "var(--color-surface)",
      }}
    >
      <div className="container-page">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "80px", // slightly taller for editorial feel
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                background: "var(--color-deep-charcoal)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShoppingBag size={20} color="var(--color-paper-ivory)" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "var(--color-deep-charcoal)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                Ahmedabad
              </div>
              <div
                className="label-caps"
                style={{
                  fontSize: "0.6rem",
                  color: "var(--color-street-saffron)",
                  marginTop: "2px",
                }}
              >
                Street Eats
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            className="hidden md:flex"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              const isAdd = link.href === "/add";
              
              if (isAdd) {
                return (
                  <Link key={link.href} href={link.href} className="btn btn-primary" style={{ marginLeft: "0.5rem" }}>
                    {link.label}
                  </Link>
                );
              }
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-200 ${isActive ? "text-[var(--color-deep-charcoal)] font-semibold border-b-2 border-[var(--color-deep-charcoal)]" : "text-[var(--color-on-surface-variant)] border-b-2 border-transparent hover:text-[var(--color-deep-charcoal)]"}`}
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            className="flex md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "transparent",
              border: "1px solid var(--border-default)",
              padding: "0.375rem",
              color: "var(--color-deep-charcoal)",
              cursor: "pointer",
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          style={{
            borderTop: "1px solid var(--border-default)",
            padding: "1rem",
            background: "var(--color-paper-ivory)",
          }}
          className="md:hidden"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            const isAdd = link.href === "/add";
            
            if (isAdd) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-primary"
                  style={{ display: "flex", width: "100%", marginTop: "0.5rem" }}
                >
                  {link.label}
                </Link>
              );
            }
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "0.75rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  fontFamily: "var(--font-sans)",
                  marginBottom: "0.25rem",
                  borderLeft: isActive ? "3px solid var(--color-deep-charcoal)" : "3px solid transparent",
                  background: isActive ? "var(--color-chai-cream)" : "transparent",
                  color: isActive ? "var(--color-deep-charcoal)" : "var(--color-on-surface-variant)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
