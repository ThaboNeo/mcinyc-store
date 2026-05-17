// THE SEAM.
//
// All order reads/writes go through this interface. The current implementation
// uses an in-memory store (no database). When you're ready to add Postgres,
// implement OrdersStore with a DB-backed class and change ONE line at the
// bottom of this file:
//
//   export const orders: OrdersStore = new PostgresOrdersStore();
//
// Nothing else (route handlers, success page, future admin pages) needs to
// change.

export type OrderItem = {
  productId: string;
  name: string;
  colorLabel: string;
  size: string;
  qty: number;
  unitAmount: number; // ZAR, whole rands
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
  amountTotal: number;    // ZAR, whole rands
  amountSubtotal: number; // ZAR, whole rands
  shippingAmount: number; // ZAR, whole rands
  currency: string;
  status: "paid" | "pending" | "failed";
  items: OrderItem[];
  shippingName: string | null;
  shippingAddress: ShippingAddress | null;
  createdAt: number; // ms
};

export interface OrdersStore {
  /** Store a newly-initiated payment as pending (called from checkout route). */
  setPending(order: Order): Promise<void>;
  /** Mark a pending order as paid after ITN confirmation. */
  confirmOrder(id: string, email?: string, name?: string): Promise<Order | null>;
  /** Read a single order by id (our m_payment_id). */
  getOrder(id: string): Promise<Order | null>;
  /** List recent paid orders (for future admin pages). */
  listOrders(limit?: number): Promise<Order[]>;
}

// ---------- IMPLEMENTATION: in-memory store ----------

class InMemoryOrdersStore implements OrdersStore {
  private store = new Map<string, Order>();

  async setPending(order: Order): Promise<void> {
    this.store.set(order.id, order);
  }

  async confirmOrder(id: string, email?: string, name?: string): Promise<Order | null> {
    const order = this.store.get(id);
    if (!order) return null;
    const confirmed: Order = {
      ...order,
      status: "paid",
      email: email ?? order.email,
      shippingName: name ?? order.shippingName,
    };
    this.store.set(id, confirmed);
    console.log("[orders] paid", {
      id: confirmed.id,
      email: confirmed.email,
      total: confirmed.amountTotal,
      items: confirmed.items.length,
    });
    return confirmed;
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.store.get(id) ?? null;
  }

  async listOrders(limit = 50): Promise<Order[]> {
    return [...this.store.values()]
      .filter((o) => o.status === "paid")
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }
}

export const orders: OrdersStore = new InMemoryOrdersStore();
