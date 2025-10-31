import type { RequestHandler } from "express";
import { verifyAccessToken } from "../auth";
import { AppError } from "../shared/errors/AppError";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(401, "UNAUTHORIZED", "Missing token");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    const err = error as Error;

    if (err.name === "TokenExpiredError") {
      throw new AppError(401, "TOKEN_EXPIRED", "Access token has expired");
    }

    if (err.name === "JsonWebTokenError") {
      throw new AppError(401, "INVALID_TOKEN", "Invalid access token");
    }

    if (err.name === "NotBeforeError") {
      throw new AppError(401, "TOKEN_NOT_ACTIVE", "Token not active yet");
    }

    // Fallback
    throw new AppError(401, "UNAUTHORISED", "Authentication failed");
  }
};
