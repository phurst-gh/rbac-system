import type { RequestHandler } from "express";
import { AppError } from "../../errors/AppError";
import { emailSchema } from "../../lib/zod";

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
