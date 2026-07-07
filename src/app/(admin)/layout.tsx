import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="admin-layout" style={{ display: "flex", minHeight: "100vh", background: "var(--surface-base)" }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: "auto", padding: "clamp(1rem, 3vw, 2rem)" }}>
        {children}
      </main>
    </div>
  );
}
