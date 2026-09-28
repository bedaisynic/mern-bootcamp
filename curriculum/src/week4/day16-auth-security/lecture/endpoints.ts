export type Method = "GET" | "POST" | "PATCH" | "DELETE";

export interface Endpoint {
  method: Method;
  path: string;
  access: string;
  body?: unknown;
}

export const SHOP_ENDPOINTS: Endpoint[] = [
  { method: "GET", path: "/products", access: "Public" },
  { method: "POST", path: "/products", access: "manager, admin", body: { name: "Desk Lamp", price: 39.99, stock: 10 } },
  { method: "DELETE", path: "/products/3", access: "admin, or a direct grant (west manager)" },
  { method: "GET", path: "/orders", access: "Logged in (customer: own · manager: own region · admin: all)" },
  { method: "GET", path: "/orders/2", access: "Owner, manager of its region, admin" },
  { method: "POST", path: "/orders", access: "Logged in", body: { items: [{ productId: 1, quantity: 2 }] } },
  { method: "PATCH", path: "/orders/1/status", access: "Manager of its region, within approval limit; admin", body: { status: "shipped" } },
  { method: "GET", path: "/admin/users", access: "admin" },
  { method: "GET", path: "/auth/me", access: "Logged in" },
];
