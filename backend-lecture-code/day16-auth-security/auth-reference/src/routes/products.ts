import { Router } from "express";
import { products, nextId } from "../db";
import { requireAuth, authorize } from "../middleware/auth";

const router = Router();

// Public: no middleware at all.
router.get("/", (req, res) => {
  res.json(products);
});

// Private: requireAuth runs first (401 if there's no valid token),
// then authorize asks the policy engine (403 if the token is valid but the answer is no).
router.post("/", requireAuth, authorize("product:create"), (req, res) => {
  const { name, price, stock } = req.body;
  if (typeof name !== "string" || typeof price !== "number" || typeof stock !== "number") {
    return res.status(400).json({ message: "Body must be { name: string, price: number, stock: number }" });
  }

  // Pick the fields we accept, instead of spreading req.body into the record.
  const product = { id: nextId.product++, name, price, stock };
  products.push(product);
  res.status(201).json(product);
});

// Admins, plus the west manager, who holds a direct grant for this one action.
router.delete("/:id", requireAuth, authorize("product:delete"), (req, res) => {
  const index = products.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Product not found" });

  const [removed] = products.splice(index, 1);
  res.json({ message: "Product deleted", product: removed });
});

export default router;
