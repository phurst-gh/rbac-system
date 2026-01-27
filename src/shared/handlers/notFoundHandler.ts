import type { RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (req, res, _next) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
};
