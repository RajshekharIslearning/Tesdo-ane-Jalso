import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
      className="gradient-hero"
    >
      <div>
        <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🍽️</div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 8vw, 5rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            marginBottom: "0.75rem",
          }}
        >
          404
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
            marginBottom: "0.5rem",
          }}
        >
          This page went missing like a popular chaat stall!
        </p>
        <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", marginBottom: "2.5rem" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-primary btn-lg">🏠 Go Home</Link>
          <Link href="/browse" className="btn btn-secondary btn-lg">Browse Vendors</Link>
        </div>
      </div>
    </div>
  );
}
