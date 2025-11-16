import type { ErrorRequestHandler } from "express";
import { isDev } from "@/env";
import { AppError } from "../shared/errors/AppError";
import { ErrorCode } from "../shared/errors/ErrorCode";
import { logger } from "../shared/lib/pino-logger";

export const errorWrapper: ErrorRequestHandler = (err, _req, res, _next) => {
  const isAppError = err instanceof AppError;

  const status = isAppError ? err.status : 500;
  const code = isAppError ? err.code : ErrorCode.INTERNAL_SERVER_ERROR;
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
      ...(isDev() && { stack: err.stack }),
    },
  });
};
