import type { ErrorRequestHandler } from "express";
import { isDev } from "@/env";
import { AppError } from "../errors/AppError";
import { logger } from "../lib/logger";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const isAppError = err instanceof AppError;

  const status = isAppError ? err.status : 500;
  const code = isAppError ? err.code : "INTERNAL_SERVER_ERROR";
  const message = isAppError ? err.message : "An unexpected error occurred";

  logger.error(
    {
      err,
      status,
      code,
      message,
      url: _req.url,
      method: _req.method,
      isAppError,
    },
    "Request error occurred",
  );

  res.status(status).json({
    status: "error",
    error: {
      code,
      message,
      // Only include stack trace in dev
      ...(isDev() && { stack: err.stack }),
    },
  });
};
