import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Ahmedabad Street Eats — a community platform for discovering and rating the best street food vendors across Ahmedabad.",
};

export default function AboutPage() {
  return (
    <div className="container-page" style={{ paddingTop: "3rem", paddingBottom: "5rem", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛺</div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          About{" "}
          <span className="text-gradient">Ahmedabad Street Eats</span>
        </h1>
        <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          A community-powered platform to discover, rate, and celebrate the vibrant street food culture of Ahmedabad.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>
        <Section title="Our Mission">
          <p>
            Ahmedabad has one of India's richest street food traditions — from the iconic <em>Manek Chowk</em> after dark to the legendary pani puri stalls of Law Garden. Yet so much of this culinary heritage is discovered only by word of mouth, invisible to newcomers and visitors.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            Our mission is to change that. We've built an open, community-powered platform where anyone can add a vendor, rate their favourite stall, and help others discover the city's best kept food secrets — all without signing up.
          </p>
        </Section>

        <Section title="How It Works">
          <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><strong style={{ color: "var(--text-primary)" }}>Discover</strong> — Browse vendors by locality, food category, or search by name</li>
            <li><strong style={{ color: "var(--text-primary)" }}>Rate</strong> — Give 1-5 stars and leave a comment (one rating per vendor, anonymous)</li>
            <li><strong style={{ color: "var(--text-primary)" }}>Contribute</strong> — Add a street food vendor you love. No account required</li>
            <li><strong style={{ color: "var(--text-primary)" }}>Explore</strong> — See which localities have the highest-rated vendors through our community rankings</li>
          </ul>
        </Section>

        <Section title="Why No Login?">
          <p>
            We believe the best community platforms remove friction. You shouldn't need to create an account to share a great food recommendation. Ratings are tied anonymously to your browser, with one rating permitted per vendor to ensure fairness.
          </p>
        </Section>

        <Section title="Content Policy">
          <p>
            All submissions are food-vendor related and subject to our community guidelines. We remove vendors or reviews that are spam, abusive, or unrelated to street food. If you see something that shouldn't be here, please use the <Link href="/report" style={{ color: "var(--brand-light)" }}>Report Content</Link> page.
          </p>
        </Section>

        <Section title="Contact Us">
          <p>
            Have a suggestion, partnership inquiry, or just want to say hello? We'd love to hear from you at{" "}
            <a href={`mailto:${SITE_CONFIG.email}`} style={{ color: "var(--brand-light)" }}>{SITE_CONFIG.email}</a>, or use our{" "}
            <Link href="/contact" style={{ color: "var(--brand-light)" }}>contact form</Link>.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: "0.75rem",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      {children}
      <div style={{ height: "1px", background: "var(--border-subtle)", marginTop: "2rem" }} />
    </div>
  );
}
