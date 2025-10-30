import type express from "express";
import { Router } from "express";
import { authRouter } from "../auth";
import { requireAuth } from "../middleware/requireAuth";

// import { rbacRouter } from "../rbac";
// import { userRouter } from "../users";

/**
 * Main Routes Module
 *
 * This file orchestrates all domain-specific route modules.
 * Each domain (auth, users, rbac) has its own route module
 *
 * Domain Structure:
 * - /auth/* - Authentication operations (login, register, refresh, etc.)
 * - /users/* - User management (profile, preferences, etc.)
 * - /rbac/* - Role-based access control (roles, permissions, assignments)
 */

const router: express.Router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

router.use("/auth", authRouter);
// router.use("/users", userRouter);
// router.use("/rbac", rbacRouter);

// Test route
router.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});
// Protected test route
router.get("/auth-test", requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

export default router;
