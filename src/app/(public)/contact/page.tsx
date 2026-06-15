"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { contactSchema, type ContactFormData } from "@/schemas";
import { SITE_CONFIG } from "@/constants";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactFormData) {
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        toast.success("Message sent! We'll get back to you soon.");
      } else {
        toast.error(json.error ?? "Failed to send message");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container-page" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr min(480px, 55%)",
          gap: "3rem",
          alignItems: "start",
        }}
        className="contact-grid"
      >
        {/* Left */}
        <div>
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
            Get in Touch
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2rem" }}>
            Have a suggestion, a partnership inquiry, or found a bug? We'd love to hear from you.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              { icon: "📧", label: "Email", value: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
              { icon: "📍", label: "Location", value: "Ahmedabad, Gujarat, India" },
              { icon: "🕐", label: "Response Time", value: "Within 24-48 hours" },
            ].map(({ icon, label, value, href }) => (
              <div key={label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "var(--surface-overlay)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.125rem",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.125rem" }}>
                    {label}
                  </div>
                  {href ? (
                    <a href={href} style={{ color: "var(--brand-light)", textDecoration: "none", fontSize: "0.9375rem" }}>
                      {value}
                    </a>
                  ) : (
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>{value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div>
          {submitted ? (
            <div
              className="card"
              style={{ padding: "3rem 2rem", textAlign: "center" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>✉️</div>
              <h2 style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Message Sent!
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>
                Thanks for reaching out. We'll get back to you within 24-48 hours.
              </p>
            </div>
          ) : (
            <div className="card" style={{ padding: "1.75rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-primary)", marginBottom: "1.25rem" }}>
                Send us a message
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label className="label" htmlFor="name">Name</label>
                  <input id="name" {...register("name")} className={`input${errors.name ? " input-error" : ""}`} placeholder="Your name" />
                  {errors.name && <p style={{ fontSize: "0.8125rem", color: "oklch(0.50 0.18 25)", marginTop: "0.25rem" }}>{errors.name.message}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="email">Email</label>
                  <input id="email" type="email" {...register("email")} className={`input${errors.email ? " input-error" : ""}`} placeholder="your@email.com" />
                  {errors.email && <p style={{ fontSize: "0.8125rem", color: "oklch(0.50 0.18 25)", marginTop: "0.25rem" }}>{errors.email.message}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="subject">Subject</label>
                  <input id="subject" {...register("subject")} className={`input${errors.subject ? " input-error" : ""}`} placeholder="What's it about?" />
                  {errors.subject && <p style={{ fontSize: "0.8125rem", color: "oklch(0.50 0.18 25)", marginTop: "0.25rem" }}>{errors.subject.message}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    {...register("message")}
                    rows={5}
                    className={`input${errors.message ? " input-error" : ""}`}
                    placeholder="Your message..."
                    style={{ resize: "vertical" }}
                  />
                  {errors.message && <p style={{ fontSize: "0.8125rem", color: "oklch(0.50 0.18 25)", marginTop: "0.25rem" }}>{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={sending} className="btn btn-primary" style={{ opacity: sending ? 0.6 : 1 }}>
                  {sending ? "Sending..." : "Send Message 📨"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
