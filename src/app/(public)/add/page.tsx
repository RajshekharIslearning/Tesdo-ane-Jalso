import type { Metadata } from "next";
import AddVendorForm from "./AddVendorForm";

export const metadata: Metadata = {
  title: "Add a Vendor",
  description: "Know a great street food vendor in Ahmedabad? Add them to the community platform. No account required.",
};

export default function AddVendorPage() {
  return (
    <div className="container-page" style={{ paddingTop: "2rem", paddingBottom: "5rem" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}
          >
            ➕ Add a Vendor
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6 }}>
            Help your community discover amazing local street food stalls. No account needed — just share the love!
          </p>
        </div>
        <AddVendorForm />
      </div>
    </div>
  );
}
