import { callService, Ctx } from "./http";

export type CartItem = { sku: string; quantity: number };

export const cartClient = {
  async getItems(ctx: Ctx): Promise<CartItem[]> {
    const { items } = await callService<{ items: CartItem[] }>(ctx, "cart", "/cart");
    return items;
  },
  clear: (ctx: Ctx) => callService<void>(ctx, "cart", "/cart", { method: "DELETE" }),
};
