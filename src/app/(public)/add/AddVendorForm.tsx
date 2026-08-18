"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { vendorSchema, type VendorFormData } from "@/schemas";
import { LOCALITIES, SPECIALITIES } from "@/constants";

type SimilarVendor = { id: string; name: string };

export default function AddVendorForm() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "duplicate-warning" | "done">("form");
  const [similar, setSimilar] = useState<SimilarVendor[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: { name: "", speciality: "", locality: "", address: "", description: "" },
  });

  const selectedSpeciality = watch("speciality");

  async function submitVendor(data: VendorFormData, forceAdd = false) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, forceAdd }),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(`${data.name} added successfully! 🎉`);
        router.push("/browse");
      } else if (json.error === "DUPLICATE_WARNING") {
        setSimilar(json.similar ?? []);
        setStep("duplicate-warning");
        setSubmitting(false);
      } else {
        toast.error(json.error ?? "Failed to add vendor");
        setSubmitting(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  function onFormSubmit(data: VendorFormData) {
    submitVendor(data, false);
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>

      {/* DUPLICATE WARNING */}
      {step === "duplicate-warning" && (
        <div
          style={{
            background: "rgba(242, 140, 40, 0.06)",
            border: "1px solid var(--color-street-saffron)",
            padding: "1.25rem 1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ fontWeight: 600, color: "var(--color-street-saffron)", marginBottom: "0.5rem", fontSize: "0.9375rem" }}>
            Similar vendors found in this locality
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
            {similar.map((v) => (
              <div key={v.id} style={{ padding: "0.2rem 0" }}>• {v.name}</div>
            ))}
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Is this a different vendor? You can still add it.
          </div>
          <div style={{ display: "flex", gap: "0.625rem" }}>
            <button onClick={() => setStep("form")} className="btn btn-secondary btn-sm">
              ← Go Back
            </button>
            <button
              onClick={handleSubmit((data) => submitVendor(data, true))}
              disabled={submitting}
              className="btn btn-primary btn-sm"
            >
              {submitting ? "Adding..." : "Add Anyway"}
            </button>
          </div>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit(onFormSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Vendor Name */}
        <div>
          <label className="label" htmlFor="name">Vendor Name *</label>
          <input
            id="name"
            {...register("name")}
            placeholder="e.g. Ramesh Pani Puri wala"
            className={`input${errors.name ? " input-error" : ""}`}
          />
          {errors.name && <p style={{ fontSize: "0.8125rem", color: "var(--color-error)", marginTop: "0.375rem" }}>{errors.name.message}</p>}
        </div>

        {/* Speciality */}
        <div>
          <label className="label" htmlFor="speciality">Speciality *</label>
          <select
            id="speciality"
            {...register("speciality")}
            className={`input${errors.speciality ? " input-error" : ""}`}
            style={{ cursor: "pointer" }}
          >
            <option value="">Select speciality</option>
            {SPECIALITIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.speciality && <p style={{ fontSize: "0.8125rem", color: "var(--color-error)", marginTop: "0.375rem" }}>{errors.speciality.message}</p>}
        </div>

        {/* Custom speciality */}
        {selectedSpeciality === "Other" && (
          <div>
            <label className="label" htmlFor="customSpeciality">Describe the speciality *</label>
            <input
              id="customSpeciality"
              {...register("customSpeciality")}
              placeholder="e.g. Gujarati thali"
              className="input"
            />
          </div>
        )}

        {/* Locality */}
        <div>
          <label className="label" htmlFor="locality">Locality *</label>
          <select
            id="locality"
            {...register("locality")}
            className={`input${errors.locality ? " input-error" : ""}`}
            style={{ cursor: "pointer" }}
          >
            <option value="">Select locality</option>
            {[...LOCALITIES].sort().map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          {errors.locality && <p style={{ fontSize: "0.8125rem", color: "var(--color-error)", marginTop: "0.375rem" }}>{errors.locality.message}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="label" htmlFor="address">
            Address / Landmark{" "}
            <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
          </label>
          <input
            id="address"
            {...register("address")}
            placeholder="e.g. Near Iscon temple, next to ATM"
            className="input"
          />
        </div>

        {/* Description */}
        <div>
          <label className="label" htmlFor="description">
            Description{" "}
            <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            id="description"
            {...register("description")}
            placeholder="Tell the community what makes this vendor special..."
            rows={3}
            maxLength={500}
            className="input"
            style={{ resize: "none" }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting || step === "duplicate-warning"}
          className="btn btn-primary btn-lg"
          style={{ opacity: submitting ? 0.6 : 1 }}
        >
          {submitting ? "Submitting..." : "Submit Vendor"}
        </button>

        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textAlign: "center" }}>
          No account required · Submissions are publicly visible
        </p>
      </form>
    </div>
  );
}
