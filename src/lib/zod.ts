import { Filter } from "bad-words";
import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .max(100, "Email must be at most 100 characters")
    .pipe(z.email("Invalid email format")),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be at most 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

const filter = new Filter();
export const workspaceNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .refine((value) => !filter.isProfane(value), "Workspace name contains blocked words"),
});
