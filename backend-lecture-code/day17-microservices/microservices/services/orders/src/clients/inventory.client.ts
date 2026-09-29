import { CartItem } from "./cart.client";
import { callService, Ctx } from "./http";

export const inventoryClient = {
  /** Reserves every item or none. Inventory commits this on ITS side immediately. */
  async reserve(ctx: Ctx, items: CartItem[]): Promise<number> {
    const { reservationId } = await callService<{ reservationId: number }>(
      ctx,
      "inventory",
      "/internal/inventory/reservations",
      { method: "POST", body: { items } }
    );
    return reservationId;
  },

  /** The compensating action: puts reserved stock back. */
  release: (ctx: Ctx, reservationId: number) =>
    callService<void>(ctx, "inventory", `/internal/inventory/reservations/${reservationId}`, {
      method: "DELETE",
    }),
};
