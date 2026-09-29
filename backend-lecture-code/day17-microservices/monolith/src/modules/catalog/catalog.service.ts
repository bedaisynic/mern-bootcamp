import { Db } from "../../db";
import { HttpError } from "../../shared/errors";
import { Product } from "../../shared/types";
import { catalogRepository } from "./catalog.repository";

export const catalogService = {
  async listProducts(category?: string): Promise<Product[]> {
    return catalogRepository.findAll(category);
  },

  async getProduct(sku: string, db?: Db): Promise<Product> {
    const product = await catalogRepository.findBySku(sku, db);
    if (!product) throw new HttpError(404, `product ${sku} not found`);
    return product;
  },

  async createProduct(input: Partial<Product>): Promise<Product> {
    const { sku, name, price, category } = input;
    if (!sku || !name || typeof price !== "number" || !category) {
      throw new HttpError(400, "sku, name, price (number), and category are required");
    }
    return catalogRepository.create({ sku, name, price, category });
  },
};
