import { Prisma } from "@prisma/client";
import type { ErrorRequestHandler } from "express";
import { isDev } from "@/env";
import { AppError } from "../shared/errors/AppError";
import { ErrorCode } from "../shared/errors/ErrorCode";

export const errorWrapper: ErrorRequestHandler = (err, _req, res, _next) => {
  // Handle Prisma errors (convert to AppError)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        err = new AppError(
          409,
          ErrorCode.WORKSPACE_MEMBER_EXISTS,
          "Member already exists in workspace",
        );
        break;
      default:
        err = new AppError(500, ErrorCode.INTERNAL_SERVER_ERROR, "Database error occurred");
    }
  }

  // Handle AppError and fallback generic errors
  const isAppError = err instanceof AppError;

  const status = isAppError ? err.status : 500;
  const code = isAppError ? err.code : ErrorCode.INTERNAL_SERVER_ERROR;
  const message = isAppError ? err.message : "An unexpected error occurred";

  res.status(status).json({
    status: "error",
    error: {
      code,
      message,
      ...(isDev() && { stack: err.stack }),
    },
  });
};
