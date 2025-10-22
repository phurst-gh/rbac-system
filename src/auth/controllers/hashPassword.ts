import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import { env } from "@/env";

export const hashPassword: RequestHandler = async (_req, res, next) => {
  const password = res.locals.validatedPassword;

  res.locals.validatedPassword = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
  console.log("Password Hash:", res.locals.validatedPassword);
  next();
};
