import bcrypt from "bcryptjs";
import type { Action } from "./policy/policies";

// No database today — everything lives in memory and resets on every restart.

export type Role = "customer" | "manager" | "admin";
export type OrderStatus = "placed" | "shipped" | "delivered" | "cancelled";
export type Region = "east" | "west";

export interface User {
  id: number;
  email: string;
  passwordHash: string | null; // null for accounts that only ever signed in with Google
  role: Role;
  provider: "password" | "google";
  // Attributes the policy engine reads. Only managers have them today.
  region?: Region; // the region whose orders this manager is responsible for
  approvalLimit?: number; // the largest order total this manager may change the status of
  permissions?: Action[]; // one-off grants for this user, on top of their role
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface Order {
  id: number;
  customerId: number;
  items: { productId: number; quantity: number }[];
  total: number;
  status: OrderStatus;
  region: Region;
}

// Every seeded account's password is "password123". We only ever store the bcrypt hash.
const seedHash = bcrypt.hashSync("123", 10);

export const users: User[] = [
  { id: 1, email: "admin@shop.com", passwordHash: seedHash, role: "admin", provider: "password" },
  // Same role, different attributes: the policy engine treats these two managers differently.
  {
    id: 2,
    email: "manager@shop.com",
    passwordHash: seedHash,
    role: "manager",
    provider: "password",
    region: "east",
    approvalLimit: 100,
  },
  {
    id: 5,
    email: "manager.west@shop.com",
    passwordHash: seedHash,
    role: "manager",
    provider: "password",
    region: "west",
    approvalLimit: 500,
    permissions: ["product:delete"], // normally admin-only, granted to this one manager
  },
  { id: 3, email: "alice@shop.com", passwordHash: seedHash, role: "customer", provider: "password" },
  { id: 4, email: "bob@shop.com", passwordHash: seedHash, role: "customer", provider: "password" },
];

export const products: Product[] = [
  { id: 1, name: "Mechanical Keyboard", price: 89.99, stock: 25 },
  { id: 2, name: "USB-C Hub", price: 34.5, stock: 60 },
  { id: 3, name: "Monitor Stand", price: 49.0, stock: 12 },
];

// Orders 1 and 3 are Alice's, order 2 is Bob's — log in as Alice and try GET /orders/2 (IDOR).
// Order 3 is east but over the east manager's $100 approval limit.
export const orders: Order[] = [
  { id: 1, customerId: 3, items: [{ productId: 1, quantity: 1 }], total: 89.99, status: "placed", region: "east" },
  { id: 2, customerId: 4, items: [{ productId: 2, quantity: 2 }], total: 69.0, status: "shipped", region: "west" },
  { id: 3, customerId: 3, items: [{ productId: 1, quantity: 5 }], total: 449.95, status: "placed", region: "east" },
];

export const nextId = { user: 6, product: 4, order: 4 };
