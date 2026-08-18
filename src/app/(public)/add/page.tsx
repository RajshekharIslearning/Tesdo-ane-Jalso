import type { Metadata } from "next";
import AddVendorForm from "./AddVendorForm";

export const metadata: Metadata = {
  title: "Add a Vendor",
  description: "Know a great street food vendor in Ahmedabad? Add them to the community directory. No account required.",
};

export default function AddVendorPage() {
  return (
    <div className="container-page" style={{ paddingTop: "64px", paddingBottom: "120px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ marginBottom: "48px", paddingBottom: "24px", borderBottom: "1px solid var(--color-deep-charcoal)" }}>
          <h1 className="display-xl" style={{ marginBottom: "16px" }}>
            Know a place<br />
            <span style={{ color: "var(--color-on-surface-variant)", fontStyle: "italic" }}>worth eating at?</span>
          </h1>
          <p className="body-lg" style={{ color: "var(--color-on-surface-variant)", lineHeight: 1.6 }}>
            Add a street-food vendor that Ahmedabad should know about. No account required.
          </p>
        </div>
        <AddVendorForm />
      </div>
    </div>
  );
}
