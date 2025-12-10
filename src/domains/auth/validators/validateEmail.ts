import { ErrorCode } from "src/shared/errors/ErrorCode";
import { emailSchema } from "@/lib/zod";
import { AppError } from "@/shared/errors/AppError";

export const validateEmail = (email: string) => {
  const validatedEmail = emailSchema.safeParse({ email });

  if (!validatedEmail.success) {
    // Aggregate all error messages, there are multiple possible validation failures
    const errorMessage = validatedEmail.error.issues.map(({ message }) => message).join(", ");

    throw new AppError(400, ErrorCode.VALIDATION_ERROR, errorMessage);
  }

  return validatedEmail.data.email;
};
