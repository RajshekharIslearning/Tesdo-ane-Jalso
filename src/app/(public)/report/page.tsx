"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { reportSchema, type ReportFormData } from "@/schemas";
import { Suspense } from "react";

function ReportForm() {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendorId") ?? "";
  const vendorName = searchParams.get("vendorName") ?? "";
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: { type: "VENDOR", vendorId: vendorId || undefined },
  });

  async function onSubmit(data: ReportFormData) {
    setSending(true);
    try {
      const res = await fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (json.success) { setSubmitted(true); toast.success("Report submitted. Thank you!"); }
      else toast.error(json.error ?? "Failed to submit report");
    } catch { toast.error("Something went wrong."); }
    finally { setSending(false); }
  }

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>✅</div>
        <h2 style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>Report Submitted</h2>
        <p style={{ color: "var(--text-secondary)" }}>Our moderation team will review it within 24-48 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {vendorName && (
        <div style={{ padding: "0.875rem 1rem", background: "var(--surface-overlay)", border: "1px solid var(--border-subtle)", borderRadius: 10, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Reporting: <strong style={{ color: "var(--text-primary)" }}>{vendorName}</strong>
        </div>
      )}
      <div>
        <label className="label">Report Type</label>
        <select {...register("type")} className="input" style={{ cursor: "pointer" }}>
          <option value="VENDOR">Vendor listing issue</option>
          <option value="RATING">Review / Rating issue</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div>
        <label className="label">Reason *</label>
        <input {...register("reason")} className={`input${errors.reason ? " input-error" : ""}`} placeholder="Briefly describe the issue (e.g. spam, fake, offensive)" />
        {errors.reason && <p style={{ fontSize: "0.8125rem", color: "oklch(0.50 0.18 25)", marginTop: "0.25rem" }}>{errors.reason.message}</p>}
      </div>
      <div>
        <label className="label">Additional Details <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span></label>
        <textarea {...register("details")} rows={4} className="input" placeholder="Any additional context..." style={{ resize: "vertical" }} />
      </div>
      <button type="submit" disabled={sending} className="btn btn-primary" style={{ opacity: sending ? 0.6 : 1 }}>
        {sending ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}

export default function ReportPage() {
  return (
    <div className="container-page" style={{ paddingTop: "3rem", paddingBottom: "5rem", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚑</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>Report Content</h1>
        <p style={{ color: "var(--text-secondary)" }}>Found something inaccurate, offensive, or spammy? Let us know and we'll look into it.</p>
      </div>
      <div className="card" style={{ padding: "1.75rem" }}>
        <Suspense fallback={<div style={{ color: "var(--text-secondary)" }}>Loading...</div>}>
          <ReportForm />
        </Suspense>
      </div>
    </div>
  );
}
