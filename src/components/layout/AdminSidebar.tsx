"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ShoppingBag, LayoutDashboard, Store, Star, Flag, MessageSquare, LogOut } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vendors", label: "Vendors", icon: Store },
  { href: "/admin/ratings", label: "Ratings", icon: Star },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        background: "var(--surface-raised)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        padding: "1.25rem 0.75rem",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "auto",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.75rem", paddingLeft: "0.25rem" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, oklch(0.68 0.20 42), oklch(0.76 0.17 55))", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShoppingBag size={16} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.1 }}>Admin</div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Street Eats</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`admin-nav-item${isActive ? " active" : ""}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
        <Link href="/" className="admin-nav-item" style={{ marginBottom: "0.25rem" }}>
          ← Back to Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="admin-nav-item"
          style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "oklch(0.60 0.15 25)" }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
