"use client";

import { useState } from "react";
import { toast } from "sonner";

const STAR_LABELS = ["", "Poor", "Below average", "Average", "Good", "Excellent"];

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
        toast.success("Rating submitted. Thank you.");
      } else if (data.error === "You have already rated this vendor") {
        setSubmitted(true);
        toast.info("You've already rated this vendor.");
      } else {
        toast.error(data.error ?? "Failed to submit rating.");
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
        style={{ padding: "32px", textAlign: "center", border: "1px solid var(--color-deep-charcoal)", background: "var(--color-chai-cream)" }}
      >
        <div className="headline-sm" style={{ marginBottom: "8px", color: "var(--color-deep-charcoal)" }}>
          Thanks for rating.
        </div>
        <div className="body-md" style={{ color: "var(--color-on-surface-variant)" }}>
          Your vote helps others find the best spots.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", border: "1px solid var(--color-deep-charcoal)", background: "var(--color-chai-cream)" }}>
      <h3 className="headline-sm" style={{ marginBottom: "24px" }}>
        Rate this place
      </h3>

      {/* Stars */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => setStars(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            style={{
              background: "none",
              border: "1px solid",
              borderColor: (hover || stars) >= s ? "var(--color-deep-charcoal)" : "var(--color-outline-variant)",
              backgroundColor: (hover || stars) >= s ? "var(--color-paper-ivory)" : "transparent",
              cursor: "pointer",
              fontSize: "24px",
              color: (hover || stars) >= s ? "var(--color-street-saffron)" : "var(--color-surface-dim)",
              transition: "all 0.1s ease",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label={`Rate ${s} star${s !== 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
      {(hover || stars) > 0 && (
        <div className="label-caps" style={{ color: "var(--color-deep-charcoal)", marginBottom: "24px" }}>
          {STAR_LABELS[hover || stars]}
        </div>
      )}

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What did you think? (optional)"
        rows={4}
        maxLength={500}
        className="input"
        style={{ resize: "none", marginBottom: "12px", background: "var(--color-paper-ivory)", fontSize: "16px", padding: "16px" }}
      />
      <div className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginBottom: "24px", textAlign: "right" }}>
        {comment.length}/500
      </div>

      <button
        onClick={handleSubmit}
        disabled={stars === 0 || submitting}
        className="btn btn-primary"
        style={{ width: "100%", opacity: stars === 0 || submitting ? 0.5 : 1, padding: "16px" }}
      >
        {submitting ? "Submitting..." : "Submit Rating"}
      </button>
      <p className="label-caps" style={{ color: "var(--color-on-surface-variant)", marginTop: "16px", textAlign: "center" }}>
        Anonymous · one rating per vendor
      </p>
    </div>
  );
}
