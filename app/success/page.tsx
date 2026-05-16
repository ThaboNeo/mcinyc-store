// /success?session_id=...
//
// Server component. Reads the order via the orders seam (which reads from
// Stripe today, from Postgres tomorrow — this page doesn't care).

import Link from "next/link";
import { redirect } from "next/navigation";
import { orders } from "@/lib/orders";

const TERRACOTTA = "#C85B2A";
const GOLD = "#E8C547";
const CREAM = "#F0EAD6";
const DARK = "#0F0E0B";
const MID = "#1C1A16";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect("/");
  }

  const order = await orders.getOrder(sessionId);

  if (!order || order.status === "failed") {
    return (
      <Shell>
        <h1 style={h1}>We couldn't find that order.</h1>
        <p style={p}>If you just paid, give it a moment and refresh. Otherwise head back to the store.</p>
        <Link href="/" style={cta}>← Back to the store</Link>
      </Shell>
    );
  }

  const pending = order.status === "pending";
  const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <Shell>
      <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: TERRACOTTA, marginBottom: 12 }}>
        {pending ? "PAYMENT PENDING" : "ORDER CONFIRMED"}
      </div>
      <h1 style={h1}>
        {pending ? "Almost there." : "You wear what is yours."}
      </h1>
      <p style={p}>
        {pending
          ? "Your payment is processing. We'll email you the moment it clears."
          : `Thank you${order.shippingName ? `, ${order.shippingName.split(" ")[0]}` : ""}. A receipt is on its way to ${order.email ?? "your inbox"}.`}
      </p>

      <div style={card}>
        <div style={cardHead}>
          <span style={cardLabel}>ORDER</span>
          <span style={{ ...cardLabel, opacity: 0.5 }}>{order.id.slice(-12).toUpperCase()}</span>
        </div>
        <div>
          {order.items.map((item, i) => (
            <div key={i} style={row}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: CREAM, marginBottom: 2 }}>
                  {item.name}
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 11, color: CREAM, opacity: 0.5 }}>
                  {[item.colorLabel, item.size].filter(Boolean).join(" / ")} · qty {item.qty}
                </div>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 14, color: CREAM }}>
                {money(item.unitAmount * item.qty)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14, marginTop: 4 }}>
          <SummaryRow label="Subtotal" value={money(order.amountSubtotal)} />
          <SummaryRow label="Shipping" value={money(order.shippingAmount)} />
          <SummaryRow label="Total" value={money(order.amountTotal)} emphasis />
        </div>
      </div>

      {order.shippingAddress && (
        <div style={{ ...card, marginTop: 16 }}>
          <div style={cardHead}>
            <span style={cardLabel}>SHIPPING TO</span>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: CREAM, opacity: 0.75, lineHeight: 1.7 }}>
            {order.shippingName && <div>{order.shippingName}</div>}
            <div>{order.shippingAddress.line1}</div>
            {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
            <div>
              {[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.postal_code]
                .filter(Boolean)
                .join(", ")}
            </div>
            <div>{order.shippingAddress.country}</div>
          </div>
        </div>
      )}

      <Link href="/" style={{ ...cta, marginTop: 32, display: "inline-block" }}>
        ← Keep shopping
      </Link>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: DARK, minHeight: "100vh", color: CREAM, padding: "80px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: TERRACOTTA, fontSize: 14, fontWeight: 700, marginBottom: 48, lineHeight: 1.3 }}>
          My Culture Is Not
          <br />
          Your Costume.™
        </div>
        {children}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontFamily: "monospace", fontSize: emphasis ? 14 : 12, color: CREAM, opacity: emphasis ? 1 : 0.7, fontWeight: emphasis ? 700 : 400 }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

const h1: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontWeight: 900,
  fontSize: "clamp(34px, 5vw, 52px)",
  lineHeight: 1.1,
  color: CREAM,
  marginBottom: 16,
};

const p: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: 13,
  lineHeight: 1.8,
  color: CREAM,
  opacity: 0.65,
  marginBottom: 32,
  maxWidth: 520,
};

const cta: React.CSSProperties = {
  padding: "14px 28px",
  background: "none",
  border: `1px solid rgba(255,255,255,0.25)`,
  color: CREAM,
  fontFamily: "monospace",
  fontSize: 12,
  letterSpacing: "0.12em",
  textDecoration: "none",
  borderRadius: 2,
};

const card: React.CSSProperties = {
  background: MID,
  borderRadius: 6,
  padding: 24,
  border: "1px solid rgba(255,255,255,0.08)",
};

const cardHead: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingBottom: 16,
  marginBottom: 4,
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const cardLabel: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: 10,
  letterSpacing: "0.18em",
  color: CREAM,
  opacity: 0.5,
};

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "14px 0",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
};
