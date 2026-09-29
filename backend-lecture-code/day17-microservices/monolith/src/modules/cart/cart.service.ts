import { Db } from "../../db";
import { HttpError } from "../../shared/errors";
import { CartItem } from "../../shared/types";
// Another module's service, imported and called like any local function.
import { catalogService } from "../catalog/catalog.service";
import { cartRepository } from "./cart.repository";

export const cartService = {
  async getItems(userId: number, db?: Db): Promise<CartItem[]> {
    return cartRepository.findByUser(userId, db);
  },

  async addItem(userId: number, sku: unknown, quantity: unknown = 1): Promise<CartItem[]> {
    if (typeof sku !== "string" || !sku || !Number.isInteger(quantity) || (quantity as number) < 1) {
      throw new HttpError(400, "sku and a positive integer quantity are required");
    }
    await catalogService.getProduct(sku); // throws 404 if the product doesn't exist
    await cartRepository.addItem(userId, sku, quantity as number);
    return cartRepository.findByUser(userId);
  },

  async removeItem(userId: number, sku: string): Promise<CartItem[]> {
    await cartRepository.removeItem(userId, sku);
    return cartRepository.findByUser(userId);
  },

  async clear(userId: number, db?: Db): Promise<void> {
    await cartRepository.clear(userId, db);
  },
};
