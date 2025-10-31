import { passwordSchema } from "../../../lib/zod";
import { AppError } from "../../../shared/errors/AppError";

export const validatePassword = (password: string) => {
  const parsedPassword = passwordSchema.safeParse({ password });

  if (!parsedPassword.success) {
    const errorMessage = parsedPassword.error.issues
      .map((issue: { message: string }) => issue.message)
      .join(", ");

    throw new AppError(400, "VALIDATION_ERROR", errorMessage);
  }

  return parsedPassword.data.password;
};
