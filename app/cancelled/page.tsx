// /cancelled — the customer bailed on the Stripe payment page. Cart is still
// in localStorage so they can pick up where they left off.

import Link from "next/link";

const TERRACOTTA = "#C85B2A";
const CREAM = "#F0EAD6";
const DARK = "#0F0E0B";

export default function CancelledPage() {
  return (
    <div style={{ background: DARK, minHeight: "100vh", color: CREAM, padding: "80px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: TERRACOTTA, fontSize: 14, fontWeight: 700, marginBottom: 48, lineHeight: 1.3 }}>
          My Culture Is Not
          <br />
          Your Costume.™
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: TERRACOTTA, marginBottom: 12 }}>
          CHECKOUT CANCELLED
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(34px, 5vw, 52px)", lineHeight: 1.1, color: CREAM, marginBottom: 16 }}>
          Take your time.
        </h1>
        <p style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 1.8, color: CREAM, opacity: 0.65, marginBottom: 32, maxWidth: 520 }}>
          No payment was taken. Your cart is exactly where you left it.
        </p>
        <Link
          href="/"
          style={{
            padding: "14px 28px",
            background: TERRACOTTA,
            color: DARK,
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textDecoration: "none",
            borderRadius: 2,
            display: "inline-block",
          }}
        >
          ← Back to the store
        </Link>
      </div>
    </div>
  );
}
