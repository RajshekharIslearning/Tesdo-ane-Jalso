import type { Metadata } from "next";
import { Suspense } from "react";
import BrowseClient from "./BrowseClient";

export const metadata: Metadata = {
  title: "Browse Vendors",
  description: "Find and rate street food vendors across all 70+ localities in Ahmedabad. Filter by category, locality, and rating.",
};

export default function BrowsePage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>}>
      <BrowseClient />
    </Suspense>
  );
}
