import type express from "express";
import { Router } from "express";
import { hashPassword, validateEmail, validatePassword } from "../controllers/userController";
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
);

export default router;
