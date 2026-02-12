import { workspaceNameSchema } from "@/lib/zod";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/errors/ErrorCode";

export const validateWorkspaceName = (name: string) => {
  const validatedName = workspaceNameSchema.safeParse({ name });

  if (!validatedName.success) {
    // Aggregate all error messages, there are multiple possible validation failures
    const errorMessage = validatedName.error.issues.map(({ message }) => message).join(", ");

    throw new AppError(400, ErrorCode.VALIDATION_ERROR, errorMessage);
  }

  return validatedName.data.name;
};
