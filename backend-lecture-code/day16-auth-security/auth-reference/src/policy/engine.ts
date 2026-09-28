import type { User, Order } from "../db";
import { rules, type Action, type Rule } from "./policies";

// THE POLICY ENGINE. It knows nothing about managers, regions or orders. It only knows how to
// read the rules in ./policies.ts and turn them into a yes/no, with a reason attached.

export interface Decision {
  allowed: boolean;
  reason: string;
}

function matches(rule: Rule, user: User, action: Action, order?: Order) {
  if (!rule.actions.includes(action)) return false;
  if (rule.roles && !rule.roles.includes(user.role)) return false;
  if (rule.when) {
    // An attribute check needs the actual order to look at. With no order, the rule can't match.
    return order !== undefined && rule.when(user, order);
  }
  return true;
}

export function can(user: User, action: Action, order?: Order): Decision {
  // 1. An explicit deny always wins.
  const deny = rules.find((r) => r.effect === "deny" && matches(r, user, action, order));
  if (deny) return { allowed: false, reason: deny.description };

  // 2. A permission granted to this one user directly, on top of their role. No conditions.
  if (user.permissions?.includes(action)) {
    return { allowed: true, reason: `${action} was granted directly to ${user.email}` };
  }

  // 3. Any allow rule that matches.
  const allow = rules.find((r) => r.effect === "allow" && matches(r, user, action, order));
  if (allow) return { allowed: true, reason: allow.description };

  // 4. Nothing said yes, so the answer is no. Default deny.
  return { allowed: false, reason: `No rule allows ${user.role} to ${action}` };
}
