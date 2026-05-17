// POST /api/itn/payfast
//
// PayFast Instant Transaction Notification (ITN) handler.
// PayFast POSTs here after a payment completes, fails, or is cancelled.
// We verify the ITN, then confirm the order in our store.

import { NextRequest, NextResponse } from "next/server";
import { verifyITN } from "@/lib/payfast";
import { orders } from "@/lib/orders";
import type { Order } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  // URLSearchParams preserves field order, which matters for signature validation.
  const fields = Object.fromEntries(new URLSearchParams(body));

  const valid = await verifyITN(fields);
  if (!valid) {
    console.warn("[itn/payfast] ITN rejected — signature or server validation failed");
    return new NextResponse(null, { status: 400 });
  }

  const { payment_status, m_payment_id, email_address, name_first, name_last } = fields;

  if (payment_status === "COMPLETE") {
    const email = email_address || undefined;
    const name = [name_first, name_last].filter(Boolean).join(" ") || undefined;
    const order = await orders.confirmOrder(m_payment_id, email, name);
    if (order) {
      await onOrderPaid(order);
    } else {
      console.warn("[itn/payfast] confirmOrder found no pending order for", m_payment_id);
    }
  } else {
    console.warn("[itn/payfast] payment not completed", { payment_status, m_payment_id });
  }

  // PayFast requires a 200 response to acknowledge the ITN.
  return new NextResponse("OK", { status: 200 });
}

async function onOrderPaid(order: Order) {
  // TODO: wire fulfilment notification here. Example:
  //
  //   await fetch(process.env.SLACK_WEBHOOK_URL!, {
  //     method: "POST",
  //     headers: { "content-type": "application/json" },
  //     body: JSON.stringify({
  //       text: `New order ${order.id} — ${order.items.length} items — R${order.amountTotal} — ${order.email}`,
  //     }),
  //   });
  //
  // PayFast sends its own payment receipt. For a richer confirmation email,
  // use Resend or Postmark and drop it in here.
}
