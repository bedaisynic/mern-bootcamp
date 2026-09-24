import "dotenv/config";

import { sql } from "drizzle-orm";

import { db, pool } from "./pool";
import { products, inventory, orders } from "./schema";

// large enough that round-trip latency (not insert speed) is the bottleneck —
// at a few hundred rows, batching vs one-row-at-a-time both finish in ~10ms
// and the difference is noise. at this size it's seconds vs minutes.
const PRODUCT_COUNT = 20_000;
const ORDER_COUNT = 300_000;
// ~30 orders per customer — see demo-indexing
const CUSTOMER_COUNT = 10_000;
// demo-pagination — deep OFFSET pages only get slow at millions of rows
const ACTIVITY_LOG_COUNT = 10_000_000;

// rows per INSERT statement. one multi-row INSERT per batch is dramatically
// faster than one INSERT per row (fewer round trips), and batching keeps any
// single statement well under postgres' ~65535 bind-parameter limit.
const BATCH_SIZE = 2000;

function chunk<T>(rows: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < rows.length; i += size) {
    batches.push(rows.slice(i, i + size));
  }
  return batches;
}

async function seed() {
  // @faker-js/faker is ESM-only; this project is CommonJS, so it's loaded
  // via a dynamic import instead of a static one.
  const { faker } = await import("@faker-js/faker");

  console.log("seeding database...");

  // wipe first so this script is safe to re-run
  await db.delete(orders);
  await db.delete(inventory);
  await db.delete(products);

  // ---- products ----
  const productRows = Array.from({ length: PRODUCT_COUNT }, (_, i) => ({
    sku: `SKU-${String(i + 1).padStart(5, "0")}`,
    name: faker.commerce.productName(),
    priceCents: Math.round(
      Number(faker.commerce.price({ min: 3, max: 300 })) * 100,
    ),
  }));

  const insertedProducts: (typeof products.$inferSelect)[] = [];
  for (const batch of chunk(productRows, BATCH_SIZE)) {
    const rows = await db.insert(products).values(batch).returning();
    insertedProducts.push(...rows);
  }
  console.log(`inserted ${insertedProducts.length} products`);

  // ---- inventory: one row per product ----
  const inventoryRows = insertedProducts.map((p) => ({
    productId: p.id,
    quantity: faker.number.int({ min: 0, max: 250 }),
  }));

  let inventoryCount = 0;
  for (const batch of chunk(inventoryRows, BATCH_SIZE)) {
    await db.insert(inventory).values(batch);
    inventoryCount += batch.length;
  }
  console.log(`inserted ${inventoryCount} inventory rows`);

  // ---- orders: random product + qty + status ----
  const statuses = ["pending", "completed", "cancelled"] as const;
  const orderRows = Array.from({ length: ORDER_COUNT }, () => {
    // same value in both columns — only one of them is indexed
    const customerId = faker.number.int({ min: 1, max: CUSTOMER_COUNT });
    return {
      productId: faker.helpers.arrayElement(insertedProducts).id,
      quantity: faker.number.int({ min: 1, max: 10 }),
      status: faker.helpers.arrayElement(statuses),
      customerId,
      customerIdIndexed: customerId,
    };
  });

  let orderCount = 0;
  for (const batch of chunk(orderRows, BATCH_SIZE)) {
    await db.insert(orders).values(batch);
    orderCount += batch.length;
  }
  console.log(`inserted ${orderCount} orders`);

  // ---- activity_logs: 10M rows for demo-pagination ----
  // far too many to build in JS and send over in batches — one
  // INSERT ... SELECT generate_series() makes postgres create them itself,
  // in seconds. one row per second, oldest first, so id order = time order.
  await db.execute(sql`TRUNCATE activity_logs RESTART IDENTITY`);
  await db.execute(sql`
    INSERT INTO activity_logs (user_id, action, created_at)
    SELECT
      floor(random() * ${CUSTOMER_COUNT})::int + 1,
      (ARRAY['login', 'logout', 'view_product', 'add_to_cart', 'checkout'])[floor(random() * 5)::int + 1],
      now() - (${ACTIVITY_LOG_COUNT} - g) * interval '1 second'
    FROM generate_series(1, ${ACTIVITY_LOG_COUNT}) AS g
  `);
  console.log(`inserted ${ACTIVITY_LOG_COUNT} activity logs`);
}

const startedAt = Date.now();

seed()
  .then(() => console.log(`done in ${Date.now() - startedAt}ms`))
  .catch((err) => {
    console.error("seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
