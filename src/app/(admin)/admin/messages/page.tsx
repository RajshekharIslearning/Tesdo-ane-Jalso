import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatRelative } from "@/utils/format";

export const metadata: Metadata = { title: "Contact Messages — Admin" };

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "1.75rem", letterSpacing: "-0.02em" }}>
        Contact Messages
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {messages.map((m) => (
          <div key={m.id} className="card" style={{ padding: "1.25rem 1.5rem", borderLeft: m.isRead ? undefined : "3px solid var(--brand)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.625rem" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text-primary)", marginBottom: "0.125rem" }}>{m.subject}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{m.name} · <a href={`mailto:${m.email}`} style={{ color: "var(--brand-light)" }}>{m.email}</a></div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
                {!m.isRead && <span className="badge badge-brand" style={{ fontSize: "0.7rem" }}>New</span>}
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatRelative(m.createdAt)}</span>
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>No messages yet.</div>}
      </div>
    </div>
  );
}
