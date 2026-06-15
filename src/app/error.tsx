"use client";

import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }} className="gradient-hero">
      <div>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
          Something went wrong
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
          If this keeps happening, please contact us.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button onClick={reset} className="btn btn-primary">🔄 Try Again</button>
          <Link href="/" className="btn btn-secondary">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
