"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema, type AdminLoginFormData } from "@/schemas";
import { ShoppingBag } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  async function onSubmit(data: AdminLoginFormData) {
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);
    if (result?.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid email or password");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface-base)",
        padding: "1rem",
      }}
      className="gradient-hero"
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, oklch(0.68 0.20 42), oklch(0.76 0.17 55))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 0.75rem",
            }}
          >
            <ShoppingBag size={24} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Ahmedabad Street Eats</p>
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" {...register("email")} className={`input${errors.email ? " input-error" : ""}`} placeholder="admin@example.com" autoComplete="username" />
              {errors.email && <p style={{ fontSize: "0.8125rem", color: "oklch(0.50 0.18 25)", marginTop: "0.25rem" }}>{errors.email.message}</p>}
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <input id="password" type="password" {...register("password")} className={`input${errors.password ? " input-error" : ""}`} placeholder="••••••••" autoComplete="current-password" />
              {errors.password && <p style={{ fontSize: "0.8125rem", color: "oklch(0.50 0.18 25)", marginTop: "0.25rem" }}>{errors.password.message}</p>}
            </div>

            {error && (
              <div style={{ padding: "0.625rem 0.875rem", background: "oklch(0.25 0.08 25)", border: "1px solid oklch(0.40 0.12 25)", borderRadius: 8, fontSize: "0.875rem", color: "oklch(0.70 0.15 25)" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: "0.5rem", opacity: loading ? 0.6 : 1 }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
