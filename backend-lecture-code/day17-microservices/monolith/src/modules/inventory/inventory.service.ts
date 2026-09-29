import { Db } from "../../db";
import { HttpError } from "../../shared/errors";
import { inventoryRepository, Stock } from "./inventory.repository";

export const inventoryService = {
  async listStock(): Promise<Stock[]> {
    return inventoryRepository.findAll();
  },

  async getStock(sku: string): Promise<Stock> {
    const stock = await inventoryRepository.findBySku(sku);
    if (!stock) throw new HttpError(404, `no stock record for ${sku}`);
    return stock;
  },

  // Called by the orders module with ITS transaction, so this UPDATE commits
  // or rolls back together with the order. Only possible in one process.
  async reserve(sku: string, quantity: number, db?: Db): Promise<void> {
    const reserved = await inventoryRepository.decrementIfAvailable(sku, quantity, db);
    if (!reserved) throw new HttpError(409, `not enough stock for ${sku}`);
  },
};
