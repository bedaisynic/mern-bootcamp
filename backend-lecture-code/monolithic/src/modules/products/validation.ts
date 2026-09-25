import { z } from "zod";

export const SORT_KEYS = [
  "price-asc-rank",
  "price-desc-rank",
  "newest-rank",
] as const;
// note: "review-rank" isn't included — there's no reviews table/column yet
// to rank by. add it to SORT_KEYS (and a matching case in repository.ts)
// once that data exists.

export const listProductsQuerySchema = z.object({
  q: z.string().trim().optional(),
  limit: z.coerce.number().int().positive().default(100_000_000),
  skip: z.coerce.number().int().min(0).default(0),
  s: z.enum(SORT_KEYS).optional(),
});
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;

export const productIdParamSchema = z.object({
  id: z.coerce.number().int()
});

export const createProductBodySchema = z.object({
  sku: z.string().trim().min(1, "sku is required"),
  name: z.string().trim().min(1, "name is required"),
  priceCents: z.number().int().nonnegative(),
});
export type CreateProductBody = z.infer<typeof createProductBodySchema>;

export const updateProductBodySchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    priceCents: z.number().int().nonnegative().optional(),
    // #demo-s3 — set once a presigned upload finishes (see modules/uploads)
    imageUrl: z.string().trim().min(1).nullable().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined || data.priceCents !== undefined || data.imageUrl !== undefined,
    { message: "nothing to update" },
  );
export type UpdateProductBody = z.infer<typeof updateProductBodySchema>;
