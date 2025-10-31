import { emailSchema } from "../../../lib/zod";
import { AppError } from "../../../shared/errors/AppError";

export const validateEmail = (email: string) => {
  const validatedEmail = emailSchema.safeParse({ email });

  if (!validatedEmail.success) {
    const errorMessage = validatedEmail.error.issues.map(({ message }) => message).join(", ");

    throw new AppError(400, "VALIDATION_ERROR", errorMessage);
  }

  return validatedEmail.data.email;
};
