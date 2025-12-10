import { passwordSchema } from "@/lib/zod";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/errors/ErrorCode";

export const validatePassword = (password: string) => {
  const parsedPassword = passwordSchema.safeParse({ password });

  if (!parsedPassword.success) {
    // Aggregate all error messages, there are multiple possible validation failures
    const errorMessage = parsedPassword.error.issues
      .map((issue: { message: string }) => issue.message)
      .join(", ");

    throw new AppError(400, ErrorCode.VALIDATION_ERROR, errorMessage);
  }

  return parsedPassword.data.password;
};
