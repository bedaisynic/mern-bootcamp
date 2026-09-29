import { callService, Ctx } from "./http";

export type Product = { sku: string; name: string; price: number };

export const catalogClient = {
  getProduct: (ctx: Ctx, sku: string) =>
    callService<Product>(ctx, "catalog", `/products/${encodeURIComponent(sku)}`),
};
