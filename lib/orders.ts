// THE SEAM.
//
// All order reads/writes go through this interface. The initial implementation
// treats Stripe as the order ledger — no separate database. When you're ready
// to add Postgres, implement OrdersStore with a DB-backed class and change ONE
// line at the bottom of this file:
//
//   export const orders: OrdersStore = new PostgresOrdersStore();
//
// Nothing else (route handlers, success page, future admin pages) needs to
// change.

import type Stripe from "stripe";
import { getStripe } from "./stripe";

export type OrderItem = {
  productId: string;
  name: string;
  colorLabel: string;
  size: string;
  qty: number;
  unitAmount: number; // cents
};

export type ShippingAddress = {
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
};

export type Order = {
  id: string;
  email: string | null;
  amountTotal: number;
  amountSubtotal: number;
  shippingAmount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  items: OrderItem[];
  shippingName: string | null;
  shippingAddress: ShippingAddress | null;
  createdAt: number; // ms
};

export interface OrdersStore {
  /** Called from the Stripe webhook after a session completes. */
  recordOrder(session: Stripe.Checkout.Session): Promise<Order>;
  /** Read a single order by id (Stripe Checkout Session id). */
  getOrder(id: string): Promise<Order | null>;
  /** List recent orders. Used by future admin pages. */
  listOrders(limit?: number): Promise<Order[]>;
}

// ---------- IMPLEMENTATION: Stripe as the ledger ----------

class StripeBackedOrdersStore implements OrdersStore {
  async recordOrder(session: Stripe.Checkout.Session): Promise<Order> {
    // Stripe already has the canonical record of this order. The webhook
    // gives us a hook for side effects — send confirmation email, push to
    // a fulfilment queue, decrement inventory — without needing to persist
    // the order ourselves.
    //
    // When this becomes a Postgres impl, this is where the INSERT goes.
    const order = await this.hydrate(session);
    console.log("[orders] paid", {
      id: order.id,
      email: order.email,
      total: order.amountTotal / 100,
      items: order.items.length,
    });
    return order;
  }

  async getOrder(id: string): Promise<Order | null> {
    try {
      const session = await getStripe().checkout.sessions.retrieve(id, {
        expand: ["line_items", "customer_details", "shipping_cost.shipping_rate"],
      });
      return await this.hydrate(session);
    } catch (err) {
      console.error("[orders] getOrder failed", id, err);
      return null;
    }
  }

  async listOrders(limit = 50): Promise<Order[]> {
    const sessions = await getStripe().checkout.sessions.list({
      limit,
      status: "complete",
    });
    return Promise.all(sessions.data.map((s) => this.hydrate(s)));
  }

  private async hydrate(session: Stripe.Checkout.Session): Promise<Order> {
    // If line_items isn't expanded, fetch them.
    let lineItems: Stripe.ApiList<Stripe.LineItem> | undefined =
      (session as Stripe.Checkout.Session & {
        line_items?: Stripe.ApiList<Stripe.LineItem>;
      }).line_items;

    if (!lineItems) {
      lineItems = await getStripe().checkout.sessions.listLineItems(session.id, {
        limit: 100,
      });
    }

    // Cart metadata: a compact JSON array stored at session.metadata.cart
    // when the session was created. Lets us reconstruct productId / colorLabel / size
    // per item, which line_items alone don't preserve.
    const cartJson = session.metadata?.cart;
    const cartMeta: Array<{ p: string; cl: string; s: string; q: number; n: string }> =
      cartJson ? JSON.parse(cartJson) : [];

    const items: OrderItem[] = lineItems.data.map((li, idx) => {
      const meta = cartMeta[idx];
      return {
        productId: meta?.p ?? "unknown",
        name: meta?.n ?? li.description ?? "Item",
        colorLabel: meta?.cl ?? "",
        size: meta?.s ?? "",
        qty: li.quantity ?? meta?.q ?? 1,
        unitAmount: li.amount_subtotal && li.quantity
          ? Math.round(li.amount_subtotal / li.quantity)
          : 0,
      };
    });

    const addr = session.customer_details?.address;
    const shippingAddress: ShippingAddress | null = addr
      ? {
          line1: addr.line1 ?? "",
          line2: addr.line2 ?? null,
          city: addr.city ?? "",
          state: addr.state ?? null,
          postal_code: addr.postal_code ?? "",
          country: addr.country ?? "",
        }
      : null;

    return {
      id: session.id,
      email: session.customer_details?.email ?? null,
      amountTotal: session.amount_total ?? 0,
      amountSubtotal: session.amount_subtotal ?? 0,
      shippingAmount: session.shipping_cost?.amount_total ?? 0,
      currency: session.currency ?? "usd",
      status: session.payment_status === "paid" ? "paid"
            : session.payment_status === "unpaid" ? "pending"
            : "failed",
      items,
      shippingName: session.customer_details?.name ?? null,
      shippingAddress,
      createdAt: session.created * 1000,
    };
  }
}

export const orders: OrdersStore = new StripeBackedOrdersStore();
