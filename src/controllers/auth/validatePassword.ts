import type { RequestHandler } from "express";
import { AppError } from "../../errors/AppError";
import { passwordSchema } from "../../lib/zod";

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
