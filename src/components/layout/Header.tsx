"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { SITE_CONFIG } from "@/constants";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/rankings", label: "Rankings" },
  { href: "/add", label: "+ Add Vendor" },
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
        borderBottom: "1px solid var(--border-subtle)",
        backdropFilter: "blur(16px)",
        background: "rgba(15,15,15,0.85)",
      }}
    >
      <div className="container-page">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, oklch(0.68 0.20 42), oklch(0.76 0.17 55))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShoppingBag size={18} color="#fff" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Ahmedabad
              </div>
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  color: "var(--text-brand)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
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
              gap: "0.25rem",
            }}
            className="hidden md:flex"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              const isAdd = link.href === "/add";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "0.375rem 0.875rem",
                    borderRadius: 8,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                    ...(isAdd
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.68 0.20 42), oklch(0.76 0.17 55))",
                          color: "#fff",
                        }
                      : isActive
                      ? {
                          background: "oklch(0.70 0.19 55 / 0.12)",
                          color: "var(--brand-light)",
                        }
                      : {
                          color: "var(--text-secondary)",
                        }),
                  }}
                  onMouseEnter={(e) => {
                    if (!isAdd && !isActive) {
                      (e.target as HTMLElement).style.color = "var(--text-primary)";
                      (e.target as HTMLElement).style.background = "var(--surface-overlay)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAdd && !isActive) {
                      (e.target as HTMLElement).style.color = "var(--text-secondary)";
                      (e.target as HTMLElement).style.background = "transparent";
                    }
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
              background: "var(--surface-overlay)",
              border: "1px solid var(--border-default)",
              borderRadius: 8,
              padding: "0.375rem",
              color: "var(--text-primary)",
              cursor: "pointer",
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            padding: "0.75rem 1rem",
            background: "var(--surface-base)",
          }}
          className="md:hidden"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            const isAdd = link.href === "/add";
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "0.625rem 0.75rem",
                  borderRadius: 8,
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  marginBottom: "0.25rem",
                  ...(isAdd
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.68 0.20 42), oklch(0.76 0.17 55))",
                        color: "#fff",
                        textAlign: "center" as const,
                      }
                    : isActive
                    ? {
                        background: "oklch(0.70 0.19 55 / 0.12)",
                        color: "var(--brand-light)",
                      }
                    : {
                        color: "var(--text-secondary)",
                      }),
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
