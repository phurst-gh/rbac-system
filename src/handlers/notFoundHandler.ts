import type { RequestHandler } from "express";
import { logger } from "../lib/pino-logger";

export const notFoundHandler: RequestHandler = (req, res, _next) => {
  logger.warn(
    {
      method: req.method,
      url: req.url,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
    },
    "Route not found",
  );

  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
};
