import type { Role, User, Order } from "../db";

// THE POLICY CONFIG. This file is data, not logic: who may do what, and under which conditions.
// Routes never ask "is this user a manager?" anymore. They ask "can this user do ACTION?", and
// the engine (./engine.ts) answers by reading the rules below.

// Every action the API protects.
export type Action = "product:create" | "product:delete" | "order:read" | "order:updateStatus" | "user:list";

export interface Rule {
  effect: "allow" | "deny";
  actions: Action[];
  roles?: Role[]; // who the rule applies to; leave it out to mean "every role"
  when?: (user: User, order: Order) => boolean; // an attribute check; leave it out to mean "always"
  description: string; // why the rule exists, and the reason reported when it decides
}

export const rules: Rule[] = [
  // ---------------------------------------------------------------------------
  // Deny rules. Checked first, and a matching deny beats every allow, even an admin's.
  // ---------------------------------------------------------------------------
  {
    effect: "deny",
    actions: ["order:updateStatus"],
    when: (_user, order) => order.status === "delivered" || order.status === "cancelled",
    description: "A delivered or cancelled order is final",
  },

  // ---------------------------------------------------------------------------
  // RBAC: the role alone decides.
  // ---------------------------------------------------------------------------
  {
    effect: "allow",
    actions: ["product:create"],
    roles: ["manager", "admin"],
    description: "Managers and admins can add products",
  },
  {
    effect: "allow",
    actions: ["product:delete", "order:read", "order:updateStatus", "user:list"],
    roles: ["admin"],
    description: "Admins can do everything",
  },

  // ---------------------------------------------------------------------------
  // ABAC: the role gets you in the door, the attributes decide.
  // Two managers share a role, but not a region or an approval limit.
  // ---------------------------------------------------------------------------
  {
    effect: "allow",
    actions: ["order:read"],
    roles: ["customer"],
    when: (user, order) => order.customerId === user.id,
    description: "Customers can see their own orders",
  },
  {
    effect: "allow",
    actions: ["order:read"],
    roles: ["manager"],
    when: (user, order) => order.region === user.region,
    description: "Managers can see orders in their own region",
  },
  {
    effect: "allow",
    actions: ["order:updateStatus"],
    roles: ["manager"],
    when: (user, order) => order.region === user.region && order.total <= (user.approvalLimit ?? 0),
    description: "Managers can update orders in their region, up to their approval limit",
  },
];
