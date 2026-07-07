"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Trophy, PlusCircle } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Search },
  { href: "/rankings", label: "Rankings", icon: Trophy },
  { href: "/add", label: "Add", icon: PlusCircle, isAdd: true },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {NAV_ITEMS.map(({ href, label, icon: Icon, isAdd }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`mobile-nav-item${isAdd ? " mobile-nav-item-add" : isActive ? " active" : ""}`}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={20} strokeWidth={isActive || isAdd ? 2.5 : 2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
