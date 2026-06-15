import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Ahmedabad Street Eats.",
};

export default function TermsPage() {
  return (
    <div className="container-page" style={{ paddingTop: "3rem", paddingBottom: "5rem", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📋</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Last updated: June 2026</p>
      </div>

      <div style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.75, display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        {[
          ["Acceptance", "By accessing or using Ahmedabad Street Eats, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform."],
          ["Use of the Platform", "This platform is for discovering and rating street food vendors in Ahmedabad, India. You may browse, add vendors, and submit ratings without creating an account. You agree not to submit false, misleading, defamatory, or spam content."],
          ["User-Generated Content", "You retain ownership of content you submit. By submitting content, you grant Ahmedabad Street Eats a worldwide, royalty-free licence to display, distribute, and modify that content in connection with operating the platform. You are responsible for ensuring your submissions do not violate any laws or third-party rights."],
          ["Prohibited Content", "You may not submit: false business information, reviews for businesses you own or manage, personal attacks on individuals, spam or commercial solicitations, content unrelated to street food vendors."],
          ["One Rating Per Vendor", "To maintain the integrity of our community ratings, each browser session is permitted one rating per vendor. Circumventing this restriction (e.g., by clearing browser storage to submit multiple ratings) is a violation of these terms."],
          ["Moderation", "We reserve the right to remove any vendor listing, rating, or other content that violates these terms or our community guidelines, at our sole discretion. Repeat violators may be blocked from submitting content."],
          ["Disclaimer of Warranties", "The platform is provided 'as is' without warranties of any kind. We make no representations about the accuracy of vendor information submitted by users. Always verify vendor details independently."],
          ["Limitation of Liability", "Ahmedabad Street Eats shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or reliance on user-submitted content."],
          ["Changes to Terms", "We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms."],
          ["Contact", "Questions about these terms? Contact us at hello@ahmedabadstreeteats.in."],
        ].map(([title, content]) => (
          <div key={title}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{title}</h2>
            <p>{content}</p>
            <div style={{ height: 1, background: "var(--border-subtle)", marginTop: "1.75rem" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
