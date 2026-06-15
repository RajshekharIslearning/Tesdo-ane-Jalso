"use client";

import { useState } from "react";
import { toast } from "sonner";

const STAR_LABELS = ["", "Poor", "Below Average", "Average", "Good", "Excellent"];

export default function RatingSection({ vendorId, vendorName }: { vendorId: string; vendorName: string }) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (stars === 0) return;
    setSubmitting(true);

    // Get or generate a browser fingerprint
    let fingerprint = localStorage.getItem("ase_fp");
    if (!fingerprint) {
      fingerprint = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("ase_fp", fingerprint);
    }

    try {
      const res = await fetch(`/api/vendors/${vendorId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars, comment: comment.trim() || undefined, fingerprint }),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        toast.success("Rating submitted! Thank you 🙏");
      } else if (data.error === "You have already rated this vendor") {
        setSubmitted(true);
        toast.info("You've already rated this vendor");
      } else {
        toast.error(data.error ?? "Failed to submit rating");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="card"
        style={{ padding: "1.5rem", textAlign: "center" }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🙏</div>
        <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
          Thank you for rating!
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Your review helps the community discover great food.
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "1.5rem" }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "1rem" }}>
        Rate {vendorName}
      </h3>

      {/* Stars */}
      <div style={{ display: "flex", gap: "0.375rem", marginBottom: "0.5rem" }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => setStars(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "2rem",
              color: (hover || stars) >= s ? "var(--gold)" : "var(--surface-subtle)",
              transition: "color 0.1s ease, transform 0.1s ease",
              transform: (hover || stars) >= s ? "scale(1.1)" : "scale(1)",
              padding: "0.1rem",
              lineHeight: 1,
            }}
            aria-label={`Rate ${s} star${s !== 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
      {(hover || stars) > 0 && (
        <div style={{ fontSize: "0.8125rem", color: "var(--brand-light)", fontWeight: 500, marginBottom: "0.75rem" }}>
          {STAR_LABELS[hover || stars]}
        </div>
      )}

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell others what's great (optional)"
        rows={3}
        maxLength={500}
        className="input"
        style={{ resize: "none", marginBottom: "0.75rem" }}
      />
      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.75rem", textAlign: "right" }}>
        {comment.length}/500
      </div>

      <button
        onClick={handleSubmit}
        disabled={stars === 0 || submitting}
        className="btn btn-primary"
        style={{ width: "100%", opacity: stars === 0 || submitting ? 0.5 : 1 }}
      >
        {submitting ? "Submitting..." : "Submit Rating"}
      </button>
      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.75rem", textAlign: "center" }}>
        Anonymous rating · one per vendor
      </p>
    </div>
  );
}
