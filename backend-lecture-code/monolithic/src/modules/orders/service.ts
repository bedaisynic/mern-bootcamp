import { pool } from "../../db/pool";

import * as orderRepository from "./repository";


export const ORDER_STATUSES = ["pending", "completed", "cancelled"];

// state machine for PATCH /orders/:id. completed/cancelled are terminal —
// once there, no further transitions are allowed (no un-cancelling, no
// reopening a completed order).
export type OrderStatus = "pending" | "completed" | "cancelled";
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export function isValidTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

// this layer is very simple, but we create it regardless for consistency
export const getAll = async (params : any) => {
  console.log(params);
  
  const orders = await orderRepository.getAll(params);

  // log, save the request into audit history, cache policy, etc


  return orders;
};
