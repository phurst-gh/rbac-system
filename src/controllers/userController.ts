import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import { z } from "zod";

import { env } from "@/env";

import { AppError } from "../errors/AppError";

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .max(100, "Email must be at most 100 characters")
    .pipe(z.email("Invalid email format")),
});

export const validateEmail: RequestHandler = (req, res, next) => {
  const { email } = req.body;
  const parsedEmail = emailSchema.safeParse({ email });

  if (!parsedEmail.success) {
    throw new AppError(400, "VALIDATION_ERROR", "Validation failed");
  }

  res.locals.validatedEmail = parsedEmail.data.email;
  console.log("Validated Email:", res.locals.validatedEmail);
  next();
};

export const passwordHash: RequestHandler = async (req, res, next) => {
  res.locals.passwordHash = await bcrypt.hash(req.body.password, env.BCRYPT_ROUNDS);

  console.log("Password Hash:", res.locals.passwordHash);
  next();
};

export const createUser: RequestHandler = (req, res, next) => {
  // Implementation for creating a user
};
