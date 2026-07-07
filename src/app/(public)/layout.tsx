import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main className="public-layout-main" style={{ flex: 1 }}>{children}</main>
      <Footer />
      {/* Mobile bottom navigation — hidden on desktop via CSS */}
      <MobileBottomNav />
    </div>
  );
}
