import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: "Answers to common questions about Ahmedabad Street Eats.",
};

const FAQS = [
  { q: "Do I need an account to add or rate vendors?", a: "No! Ahmedabad Street Eats is designed to be completely friction-free. You can browse, add vendors, and submit ratings without creating an account or logging in." },
  { q: "Can I rate the same vendor multiple times?", a: "No. Each browser is allowed one rating per vendor to ensure fair and authentic community ratings. Your rating is tied to an anonymous browser identifier stored in localStorage." },
  { q: "What if I find a duplicate vendor?", a: "When you add a vendor, our system automatically checks for similar names in the same locality using fuzzy matching. If it finds a potential duplicate, it will warn you before adding. You can still proceed if you're sure it's a different vendor." },
  { q: "How is the average rating calculated?", a: "The average rating is simply the sum of all star ratings divided by the total number of ratings. Our locality rankings use the average of all vendor ratings within that locality." },
  { q: "How can I report a vendor or review?", a: "Use the 'Report this vendor' link at the bottom of any vendor detail page, or visit our Report Content page. Our moderation team reviews all reports." },
  { q: "Can I add a vendor from outside Ahmedabad?", a: "Currently the platform covers 70 localities within Ahmedabad. We plan to expand to other cities in future. For now, only Ahmedabad vendors can be listed." },
  { q: "How do I get a vendor verified or featured?", a: "Vendor verification and featuring is currently done by our admin team. If you'd like to request verification for a vendor, please contact us via the Contact page." },
  { q: "Is my data shared with third parties?", a: "No. We do not sell or share your data with third parties for marketing purposes. Vendor information you submit is displayed publicly on the platform. Please see our Privacy Policy for full details." },
  { q: "How do I request removal of content I submitted?", a: "Contact us at hello@ahmedabadstreeteats.in with details of the content you'd like removed. We'll process your request within 48 hours." },
  { q: "Is the platform free?", a: "Yes, Ahmedabad Street Eats is completely free for the community. There are no premium plans, subscriptions, or charges of any kind." },
];

export default function FAQPage() {
  return (
    <div className="container-page" style={{ paddingTop: "3rem", paddingBottom: "5rem", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>❓</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Everything you need to know about Ahmedabad Street Eats.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {FAQS.map(({ q, a }) => (
          <details
            key={q}
            style={{
              background: "var(--surface-raised)",
              border: "1px solid var(--border-subtle)",
              borderRadius: 12,
              padding: "1.125rem 1.25rem",
              cursor: "pointer",
            }}
          >
            <summary
              style={{
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: "var(--text-primary)",
                listStyle: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {q}
              <span style={{ color: "var(--text-muted)", fontSize: "1.125rem", flexShrink: 0 }}>+</span>
            </summary>
            <p style={{ marginTop: "0.875rem", fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
