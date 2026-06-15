import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Ahmedabad Street Eats — how we handle your data.",
};

export default function PrivacyPage() {
  return <StaticContentPage title="Privacy Policy" emoji="🔒" updatedAt="June 2026" sections={privacySections} />;
}

const privacySections = [
  {
    title: "Information We Collect",
    content: `We collect minimal information necessary to operate the platform. When you add a vendor or submit a rating, we store the content you provide (vendor name, speciality, locality, rating, comment) along with a randomly-generated browser identifier ("fingerprint") to enforce the one-rating-per-vendor policy. We do not require you to provide your name, email, or any personally identifiable information to use the core features of this platform.`,
  },
  {
    title: "How We Use Your Information",
    content: `The information you submit is used exclusively to power the community platform — displaying vendor listings, calculating ratings, and showing locality rankings. We do not sell, rent, or share your data with third parties for marketing purposes.`,
  },
  {
    title: "Cookies and Local Storage",
    content: `We store a randomly-generated anonymous identifier in your browser's localStorage (key: "ase_fp"). This identifier is used solely to prevent duplicate ratings. It contains no personal information and cannot be used to identify you. You can clear this at any time by clearing your browser's localStorage.`,
  },
  {
    title: "User-Generated Content",
    content: `All vendor listings and ratings submitted to this platform become part of the public community database. Please do not include personal information about yourself or others in vendor descriptions or review comments. Content that violates our community guidelines may be removed by our moderation team.`,
  },
  {
    title: "Data Retention",
    content: `Vendor listings and ratings are retained indefinitely as they form the core of the community database. If you wish to request removal of content you submitted, please contact us using the Contact Us page. Admin accounts and contact form messages are retained for operational purposes.`,
  },
  {
    title: "Security",
    content: `We implement industry-standard security measures including encrypted database connections, secure HTTP headers, and input validation on all submitted data. Admin access is protected by hashed passwords and secure session management.`,
  },
  {
    title: "Third-Party Services",
    content: `We may use third-party services for image hosting (Cloudinary), database hosting, and application hosting (Vercel). These services have their own privacy policies. We do not use third-party analytics or advertising trackers.`,
  },
  {
    title: "Contact",
    content: `If you have questions or concerns about this privacy policy or the data we hold, please contact us at hello@ahmedabadstreeteats.in or use our Contact Us page.`,
  },
];

function StaticContentPage({
  title,
  emoji,
  updatedAt,
  sections,
}: {
  title: string;
  emoji: string;
  updatedAt: string;
  sections: { title: string; content: string }[];
}) {
  return (
    <div className="container-page" style={{ paddingTop: "3rem", paddingBottom: "5rem", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{emoji}</div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 2.75rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Last updated: {updatedAt}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {sections.map((s) => (
          <div key={s.title}>
            <h2
              style={{
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "0.625rem",
                letterSpacing: "-0.01em",
              }}
            >
              {s.title}
            </h2>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>{s.content}</p>
            <div style={{ height: 1, background: "var(--border-subtle)", marginTop: "2rem" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
