import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

// note: schema is defined here with drizzle so we get types + a seed script,
// but the CRUD endpoints below still talk to postgres with raw SQL for now.

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: varchar("sku", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  priceCents: integer("price_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  // #demo-s3 — set via PATCH /products/:id once the presigned upload
  // finishes; nullable since most seeded products never get an image.
  imageUrl: varchar("image_url", { length: 500 }),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .unique()
    .references(() => products.id),
  quantity: integer("quantity").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  status: varchar("status", { length: 32 }).notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),

  // the same customer id stored twice — identical values, the ONLY
  // difference is that the second column has an index. nullable so rows
  // inserted by POST /orders (which doesn't set a customer) still work.
  customerId: integer("customer_id"), // no index → sequential scan
  customerIdIndexed: integer("customer_id_indexed"), // indexed below
}, (t) => [
  // same as: CREATE INDEX orders_customer_id_indexed_idx ON orders (customer_id_indexed);
  index("orders_customer_id_indexed_idx").on(t.customerIdIndexed),
]);

// #demo-atomicity
// audit trail for POST /inventory/:id/adjust — exists specifically to give
// that transaction a second real write, so ATOMICITY ("all or nothing") has
// something concrete to demonstrate. see inventory/service.ts:adjust().
export const inventoryAdjustments = pgTable("inventory_adjustments", {
  id: serial("id").primaryKey(),
  inventoryId: integer("inventory_id")
    .notNull()
    .references(() => inventory.id),
  delta: integer("delta").notNull(),
  previousQuantity: integer("previous_quantity").notNull(),
  newQuantity: integer("new_quantity").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// demo-pagination (see DEMOS.md)
// an append-only activity feed, seeded with 10 million rows — big enough
// that deep OFFSET pages are visibly slow. paginated newest-first by id,
// which the primary-key index already covers.
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: varchar("action", { length: 32 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// backs the Idempotency-Key pattern on POST /inventory (see
// inventory/service.ts:create()). generic on purpose — any endpoint could
// use this table, only inventory's create is wired up to it for now.
export const idempotencyKeys = pgTable("idempotency_keys", {
  key: varchar("key", { length: 255 }).primaryKey(),
  requestBody: jsonb("request_body").notNull(),
  statusCode: integer("status_code").notNull(),
  responseBody: jsonb("response_body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});