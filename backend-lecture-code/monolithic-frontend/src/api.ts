const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3100";

export type Product = {
  id: number;
  sku: string;
  name: string;
  priceCents: number;
  createdAt: string;
};

export type InventoryRow = {
  id: number;
  productId: number;
  quantity: number;
  updatedAt: string;
};

export type OrderStatus = "pending" | "completed" | "cancelled";

// orders go through raw SQL on the backend (not drizzle), so the JSON keys
// coming back are the literal postgres column names — snake_case, unlike
// the camelCase products/inventory return.
export type Order = {
  id: number;
  product_id: number;
  quantity: number;
  status: OrderStatus;
  created_at: string;
  customer_id: number | null;
  customer_id_indexed: number | null;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body?.error?.message ?? message;
    } catch {
      // body wasn't JSON — fall back to statusText
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  listProducts(opts: { q?: string; skip?: number; limit?: number } = {}): Promise<Product[]> {
    const { q, skip = 0, limit = 12 } = opts;
    const params = new URLSearchParams({ limit: String(limit), skip: String(skip) });
    if (q) params.set("q", q);
    return request<Product[]>(`/products?${params}`);
  },

  listInventory(opts: { offset?: number; limit?: number } = {}): Promise<InventoryRow[]> {
    const { offset = 0, limit = 20 } = opts;
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    return request<InventoryRow[]>(`/inventory?${params}`);
  },

  // the indexed by-customer lookup returns every matching row (no
  // limit/offset support on the backend) — fine here since it's scoped to
  // one customer's orders, not the whole table.
  listOrdersByCustomer(customerId: number): Promise<Order[]> {
    return request<Order[]>(`/orders/by-customer-indexed/${customerId}`);
  },

  placeOrder(productId: number, quantity: number, customerId: number): Promise<Order> {
    return request<Order>(`/orders`, {
      method: "POST",
      body: JSON.stringify({ productId, quantity, customerId }),
    });
  },

  updateOrderStatus(id: number, status: "completed" | "cancelled"): Promise<Order> {
    return request<Order>(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
