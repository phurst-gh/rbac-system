import type express from "express";
import { Router } from "express";
import { requireAuth } from "src/middleware/requireAuth";
import { createUser, hashPassword, validateEmail, validatePassword } from "../controllers/auth";
import { asyncHandler } from "../handlers/asyncHandler";

const router: express.Router = Router();

// Health check route
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API
router.post(
  "/auth/register",
  asyncHandler(validateEmail),
  asyncHandler(validatePassword),
  asyncHandler(hashPassword),
  asyncHandler(createUser),
);

// Example protected route
router.get("/me", requireAuth, (req, res) => {
  res.json({ me: req.user });
});

export default router;
