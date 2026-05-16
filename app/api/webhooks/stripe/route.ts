// POST /api/webhooks/stripe
//
// Stripe sends events here. The ONE that matters for fulfilment is
// `checkout.session.completed` — that's when money has moved. We verify
// Stripe's signature, then hand off to the orders seam for recording +
// any side effects (email, inventory, fulfilment queue).

import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { orders } from "@/lib/orders";

export const runtime = "nodejs";
// IMPORTANT: do not let Next.js parse the body — we need the raw bytes for
// Stripe's signature verification.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Re-fetch with line_items expanded so orders.hydrate can build items.
        const full = await getStripe().checkout.sessions.retrieve(session.id, {
          expand: ["line_items", "customer_details", "shipping_cost.shipping_rate"],
        });

        const order = await orders.recordOrder(full);

        // SIDE EFFECTS go here. Stripe already sends a receipt; add your own:
        // - notify fulfilment (Slack / email to the team)
        // - decrement inventory when you have a DB
        // - mark email for marketing list
        await onOrderPaid(order);
        break;
      }
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.warn("[webhook] async payment failed", session.id);
        break;
      }
      default:
        // Ignore everything else. Stripe sends many event types you don't care about.
        break;
    }
  } catch (err) {
    console.error("[webhook] handler error", err);
    // Return 500 so Stripe retries. Webhooks are at-least-once; this is fine
    // as long as recordOrder is idempotent (and reading from Stripe is).
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function onOrderPaid(order: Awaited<ReturnType<typeof orders.recordOrder>>) {
  // TODO: wire fulfilment notification here. Example:
  //
  //   await fetch(process.env.SLACK_WEBHOOK_URL!, {
  //     method: "POST",
  //     headers: { "content-type": "application/json" },
  //     body: JSON.stringify({
  //       text: `New order ${order.id} — ${order.items.length} items — $${(order.amountTotal/100).toFixed(2)} — ${order.email}`,
  //     }),
  //   });
  //
  // Stripe will email a receipt automatically. You may want a richer one via
  // Resend/Postmark — drop it in here.
}
