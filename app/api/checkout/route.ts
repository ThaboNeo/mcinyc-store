// POST /api/checkout
//
// Receives: { items: CartItemPayload[], regionId: string }
// Returns:  { fields: Record<string, string>, payfastUrl: string }
//           — POST the fields as a hidden form to payfastUrl to redirect the
//             customer to the PayFast payment page.
//
// SECURITY: We never trust prices from the client. Every item is validated
// server-side against PRODUCTS. The client only sends identifiers + quantity.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { findProduct } from "@/lib/products";
import { findRegion } from "@/lib/shipping";
import { buildPaymentFields } from "@/lib/payfast";
import { orders } from "@/lib/orders";
import type { OrderItem } from "@/lib/orders";

export const runtime = "nodejs";

const CartItemSchema = z.object({
  productId: z.string().min(1),
  colorIdx: z.number().int().min(0),
  size: z.string().min(1),
  qty: z.number().int().min(1).max(50),
});

const PayloadSchema = z.object({
  items: z.array(CartItemSchema).min(1).max(20),
  regionId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let payload: z.infer<typeof PayloadSchema>;
  try {
    payload = PayloadSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const region = findRegion(payload.regionId);
  if (!region) {
    return NextResponse.json({ error: "Unknown shipping region" }, { status: 400 });
  }

  const orderItems: OrderItem[] = [];
  let subtotalZAR = 0;

  for (const item of payload.items) {
    const product = findProduct(item.productId);
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${item.productId}` }, { status: 400 });
    }
    const colorway = product.colorways[item.colorIdx];
    if (!colorway) {
      return NextResponse.json({ error: `Invalid colorway for ${product.id}` }, { status: 400 });
    }
    if (!product.sizes.includes(item.size)) {
      return NextResponse.json({ error: `Invalid size for ${product.id}` }, { status: 400 });
    }

    orderItems.push({
      productId: product.id,
      name: product.name,
      colorLabel: colorway.label,
      size: item.size,
      qty: item.qty,
      unitAmount: product.priceZAR,
    });
    subtotalZAR += product.priceZAR * item.qty;
  }

  const shippingZAR = region.amountZAR;
  const totalZAR = subtotalZAR + shippingZAR;
  const paymentId = randomUUID();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Persist order as pending so the success page can show it immediately
  // after PayFast redirects back, before the ITN fires.
  await orders.setPending({
    id: paymentId,
    email: null,
    amountTotal: totalZAR,
    amountSubtotal: subtotalZAR,
    shippingAmount: shippingZAR,
    currency: "ZAR",
    status: "pending",
    items: orderItems,
    shippingName: null,
    shippingAddress: null,
    createdAt: Date.now(),
  });

  const itemName =
    orderItems.length === 1
      ? `${orderItems[0].name} — ${orderItems[0].colorLabel} / ${orderItems[0].size}`
      : `Order — ${orderItems.length} items`;

  const { fields, payfastUrl } = buildPaymentFields({
    paymentId,
    totalRands: totalZAR,
    itemName,
    returnUrl: `${siteUrl}/success?payment_id=${paymentId}`,
    cancelUrl: `${siteUrl}/cancelled`,
    notifyUrl: `${siteUrl}/api/itn/payfast`,
  });

  return NextResponse.json({ fields, payfastUrl });
}
