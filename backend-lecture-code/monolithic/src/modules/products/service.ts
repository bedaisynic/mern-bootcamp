import { redisClient } from "../../redis/client";
import { ConflictError, NotFoundError } from "../../lib/errors";
import { productsRepository, type Product } from "./repository";
import type {
  CreateProductBody,
  ListProductsQuery,
  UpdateProductBody,
} from "./validation";

// #demo-cache-aside (see DEMOS.md)
// cache-aside: check redis first, fall back to the repository on a miss,
// then populate redis for next time. two patterns are demonstrated here —
// versioned keys for the list endpoint (avoids ever needing KEYS/SCAN to
// invalidate a whole family of cached queries) and a direct per-id key for
// single-item reads (invalidated by deleting that one key on write).
const CACHE_VERSION_KEY = "products:cache:version";
const LIST_TTL_SECONDS = 30;
const ITEM_TTL_SECONDS = 60;

async function getCacheVersion(): Promise<number> {
  const version = await redisClient.get(CACHE_VERSION_KEY);
  return version ? Number(version) : 0;
}

async function bumpCacheVersion(): Promise<void> {
  // INCR creates the key at 1 if it doesn't exist yet, so there's no
  // separate "initialize the version" step needed.
  await redisClient.incr(CACHE_VERSION_KEY);
}

function listCacheKey(version: number, query: ListProductsQuery): string {
  return `products:list:v${version}:${JSON.stringify(query)}`;
}

function itemCacheKey(id: number): string {
  return `products:item:${id}`;
}

function isUniqueViolation(err: unknown): boolean {
  // drizzle wraps the driver error in a DrizzleQueryError — the real pg
  // error (with .code) lives at err.cause, not on err itself.
  const pgErr = err as { code?: string; cause?: { code?: string } } | null;
  return pgErr?.code === "23505" || pgErr?.cause?.code === "23505";
}

export const productsService = {
  // #demo-cache-aside — read path, versioned list key
  async list(query: ListProductsQuery): Promise<Product[]> {

    // #demo-error-handling — uncomment to see an unknown error become a clean 500
    // throw new Error("just felt like throwing an error today")

    const version = await getCacheVersion();
    const key = listCacheKey(version, query);

    const cached = await redisClient.get(key);
    if (cached) return JSON.parse(cached);

    const rows = await productsRepository.list(query);
    await redisClient.set(key, JSON.stringify(rows), {
      expiration: { type: "EX", value: LIST_TTL_SECONDS },
    });
    return rows;
  },

  async getById(id: number): Promise<Product> {
    const key = itemCacheKey(id);

    const cached = await redisClient.get(key);
    if (cached) return JSON.parse(cached);

    const product = await productsRepository.findById(id);
    if (!product) throw new NotFoundError(`product ${id} not found`);

    await redisClient.set(key, JSON.stringify(product), {
      expiration: { type: "EX", value: ITEM_TTL_SECONDS },
    });
    return product;
  },

  async create(data: CreateProductBody): Promise<Product> {
    try {
      const product = await productsRepository.create(data);
      await bumpCacheVersion();
      return product;
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new ConflictError(
          `product with sku ${data.sku} already exists`,
        );
      }
      throw err;
    }
  },

  // #demo-cache-aside — write path: bump list version + DEL the item key
  async update(id: number, data: UpdateProductBody): Promise<Product> {
    const product = await productsRepository.update(id, data);
    if (!product) throw new NotFoundError(`product ${id} not found`);

    await Promise.all([bumpCacheVersion(), redisClient.del(itemCacheKey(id))]);
    return product;
  },

  async remove(id: number): Promise<void> {
    const deleted = await productsRepository.delete(id);
    if (!deleted) throw new NotFoundError(`product ${id} not found`);

    await Promise.all([bumpCacheVersion(), redisClient.del(itemCacheKey(id))]);
  },
};
