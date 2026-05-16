// POST /api/checkout
//
// Receives: { items: CartItemPayload[], regionId: string }
// Returns:  { url: string }  — the Stripe Checkout Session URL to redirect to
//
// SECURITY: We never trust the prices the client sends. Every item is looked
// up server-side in PRODUCTS and the line items are constructed from that
// data. The client only sends identifiers + quantity.

import type Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { findProduct } from "@/lib/products";
import { findRegion } from "@/lib/shipping";

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
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const region = findRegion(payload.regionId);
  if (!region) {
    return NextResponse.json({ error: "Unknown shipping region" }, { status: 400 });
  }

  // Build line items from server-side product data. Compact cart metadata
  // (per-item productId / colorLabel / size / qty / name) is encoded into
  // session.metadata so the webhook and success page can reconstruct what
  // was ordered.
  type _CreateParams = NonNullable<Parameters<Stripe["checkout"]["sessions"]["create"]>[0]>;
  const lineItems: NonNullable<_CreateParams["line_items"]> = [];
  const cartMeta: Array<{ p: string; cl: string; s: string; q: number; n: string }> = [];

  for (const item of payload.items) {
    const product = findProduct(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${item.productId}` },
        { status: 400 }
      );
    }
    const colorway = product.colorways[item.colorIdx];
    if (!colorway) {
      return NextResponse.json(
        { error: `Invalid colorway for ${product.id}` },
        { status: 400 }
      );
    }
    if (!product.sizes.includes(item.size)) {
      return NextResponse.json(
        { error: `Invalid size for ${product.id}` },
        { status: 400 }
      );
    }

    lineItems.push({
      quantity: item.qty,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: `${product.name} — ${colorway.label} / ${item.size}`,
          description: product.description.slice(0, 200),
          metadata: {
            productId: product.id,
            colorLabel: colorway.label,
            size: item.size,
          },
        },
      },
    });

    cartMeta.push({
      p: product.id,
      cl: colorway.label,
      s: item.size,
      q: item.qty,
      n: product.name,
    });
  }

  const cartJson = JSON.stringify(cartMeta);
  if (cartJson.length > 500) {
    // Stripe metadata caps each value at 500 chars. In practice ~10 items fit;
    // beyond that we'd need to chunk across multiple keys. Surface this clearly
    // rather than silently truncating.
    return NextResponse.json(
      { error: "Cart too large. Please split your order." },
      { status: 400 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      // One shipping option, already correctly priced for this region.
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: `${region.name} — Standard`,
            fixed_amount: {
              amount: region.amount,
              currency: "usd",
            },
            delivery_estimate: {
              minimum: { unit: "business_day", value: region.estimateDays.min },
              maximum: { unit: "business_day", value: region.estimateDays.max },
            },
          },
        },
      ],
      // Hard-restrict the address-collection countries to this region. A
      // customer who picked "USA, Canada, UK & EU" cannot enter a ZA address.
      shipping_address_collection: {
        // Stripe types this as an enum; cast is safe because our region
        // country codes are all valid ISO 3166-1 alpha-2.
        allowed_countries: region.countries as unknown as NonNullable<
          NonNullable<_CreateParams["shipping_address_collection"]>["allowed_countries"]
        >,
      },
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancelled`,
      metadata: {
        cart: cartJson,
        regionId: region.id,
      },
      // Turn this on once you're registered for sales tax somewhere:
      // automatic_tax: { enabled: true },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a URL" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[/api/checkout] Stripe error", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
