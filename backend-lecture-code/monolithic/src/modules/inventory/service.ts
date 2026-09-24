import { db } from "../../db/pool";
import { ConflictError, NotFoundError } from "../../lib/errors";
import { inventoryRepository, type InventoryRow } from "./repository";
import type {
  CreateInventoryBody,
  ListInventoryQuery,
} from "./validation";

function pgErrorCode(err: unknown): string | undefined {
  // drizzle wraps the driver error in a DrizzleQueryError — the real pg
  // error (with .code) lives at err.cause, not on err itself.
  const pgErr = err as { code?: string; cause?: { code?: string } } | null;
  return pgErr?.code ?? pgErr?.cause?.code;
}

// NOT JSON.stringify(a) !== JSON.stringify(b) — jsonb doesn't preserve key
// order on the way back out of postgres ({productId, quantity} in can come
// back {quantity, productId}), so two identical bodies can stringify to
// different text. Compare the known fields directly instead.
function sameCreateBody(a: CreateInventoryBody, b: unknown): boolean {
  if (typeof b !== "object" || b === null) return false;
  const candidate = b as Record<string, unknown>;
  return candidate.productId === a.productId && candidate.quantity === a.quantity;
}

export const inventoryService = {
  async list(query: ListInventoryQuery): Promise<InventoryRow[]> {
    return inventoryRepository.list(query);
  },

  async getById(id: number): Promise<InventoryRow> {
    const row = await inventoryRepository.findById(id);
    if (!row) throw new NotFoundError(`inventory row ${id} not found`);
    return row;
  },

  // #demo-idempotency (see DEMOS.md)
  // IDEMPOTENCY KEY: a client-supplied header (see Day 11) that makes a
  // POST safe to retry. On a first request with a given key, this creates
  // the row and remembers the response under that key. On a retry with the
  // *same* key, it replays the exact same response instead of creating a
  // second row — a flaky network causing the client to resend the same
  // request should never double-create inventory. Reusing a key with a
  // *different* body is treated as a client error, not a replay.
  //
  // honestly, PATCH and POST /:id/adjust should support this too — skipped
  // here to keep them simple, since they already demonstrate ISOLATION and
  // (adjust) ATOMICITY via their transactions below.
  async create(
    data: CreateInventoryBody,
    idempotencyKey?: string,
  ): Promise<{ statusCode: number; row: InventoryRow }> {
    if (idempotencyKey) {
      const existing =
        await inventoryRepository.findIdempotencyRecord(idempotencyKey);
      if (existing) {
        if (!sameCreateBody(data, existing.requestBody)) {
          throw new ConflictError(
            `idempotency key ${idempotencyKey} was already used with a different request body`,
          );
        }
        return {
          statusCode: existing.statusCode,
          row: existing.responseBody as InventoryRow,
        };
      }
    }

    try {
      const row = await inventoryRepository.create(data);
      if (idempotencyKey) {
        await inventoryRepository.saveIdempotencyRecord(
          idempotencyKey,
          data,
          201,
          row,
        );
      }
      return { statusCode: 201, row };
    } catch (err) {
      const code = pgErrorCode(err);
      if (code === "23503") {
        throw new ConflictError(`product ${data.productId} does not exist`);
      }
      if (code === "23505") {
        throw new ConflictError(
          `product ${data.productId} already has an inventory row`,
        );
      }
      throw err;
    }
  },

  // PATCH — absolute overwrite, idempotent by nature (replaying the same
  // body twice is a no-op the second time), so it doesn't need an
  // Idempotency-Key to get that property the way POST /inventory does.
  async setQuantity(id: number, quantity: number): Promise<InventoryRow> {
    const row = await db.transaction(async (tx) => {
      // #demo-isolation (see DEMOS.md)
      // ISOLATION: FOR UPDATE locks this row for the rest of the
      // transaction. A second setQuantity()/adjust() on the same id has to
      // wait for this one to commit or roll back — it can't read the same
      // starting row and race this one to write.
      const current = await inventoryRepository.findByIdForUpdate(tx, id);
      if (!current) return undefined;
      return inventoryRepository.setQuantity(tx, id, quantity);
    });

    if (!row) throw new NotFoundError(`inventory row ${id} not found`);
    return row;
  },

  // POST /:id/adjust — signed delta, not idempotent. the row lock inside
  // the transaction is what stops two concurrent adjustments from both
  // reading the same starting quantity and pushing it negative.
  async adjust(id: number, delta: number): Promise<InventoryRow> {
    const row = await db.transaction(async (tx) => {
      // #demo-isolation
      // ISOLATION: same FOR UPDATE lock as setQuantity() above — this is
      // what stops two concurrent adjustments from both reading "222" and
      // both computing their result off that same stale number.
      const current = await inventoryRepository.findByIdForUpdate(tx, id);
      if (!current) return undefined;

      const nextQuantity = current.quantity + delta;

      // #demo-atomicity (see DEMOS.md)
      // ATOMICITY: this audit-log insert and the quantity update below are
      // one unit — either both happen or neither does. If the guard right
      // after this throws, this insert — even though it already ran,
      // moments ago — is rolled back along with everything else in the
      // transaction. Prove it: adjust by a delta that goes negative, then
      // check inventory_adjustments — there's no row for that attempt.
      await inventoryRepository.logAdjustment(tx, {
        inventoryId: id,
        delta,
        previousQuantity: current.quantity,
        newQuantity: nextQuantity,
      });

      if (nextQuantity < 0) {
        throw new ConflictError(
          `adjustment of ${delta} would take quantity below 0 (currently ${current.quantity})`,
        );
      }

      return inventoryRepository.setQuantity(tx, id, nextQuantity);
    });

    if (!row) throw new NotFoundError(`inventory row ${id} not found`);
    return row;
  },
};
