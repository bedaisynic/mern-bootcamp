import { Router } from "express";
import { users } from "../db";
import { requireAuth, authorize } from "../middleware/auth";

const router = Router();

// Middleware at the router level: every route below is admin-only.
router.use(requireAuth, authorize("user:list"));

router.get("/users", (req, res) => {
  // Never send the password hashes back, not even to an admin.
  res.json(
    users.map(({ id, email, role, provider, region, approvalLimit, permissions }) => ({
      id,
      email,
      role,
      provider,
      region,
      approvalLimit,
      permissions,
    }))
  );
});

export default router;
