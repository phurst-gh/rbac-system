import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";

import { env } from "@/env";

import { AppError } from "../errors/AppError";
import { emailSchema, passwordSchema } from "../schema/zod";

export const validateEmail: RequestHandler = (req, res, next) => {
  const { email } = req.body;
  const parsedEmail = emailSchema.safeParse({ email });

  if (!parsedEmail.success) {
    const errorMessage = parsedEmail.error.issues.map(({ message }) => message).join(", ");

    throw new AppError(400, "VALIDATION_ERROR", errorMessage);
  }

  res.locals.validatedEmail = parsedEmail.data.email;
  console.log("Validated Email:", res.locals.validatedEmail);
  next();
};

export const validatePassword: RequestHandler = (req, res, next) => {
  const { password } = req.body;
  const parsedPassword = passwordSchema.safeParse({ password });

  if (!parsedPassword.success) {
    const errorMessage = parsedPassword.error.issues
      .map((issue: { message: string }) => issue.message)
      .join(", ");

    throw new AppError(400, "VALIDATION_ERROR", errorMessage);
  }

  res.locals.validatedPassword = parsedPassword.data.password;
  next();
};

export const hashPassword: RequestHandler = async (_req, res, next) => {
  const password = res.locals.validatedPassword;

  res.locals.passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
  console.log("Password Hash:", res.locals.passwordHash);
  next();
};

export const createUser: RequestHandler = (req, res, next) => {
  // Implementation for creating a user
};
