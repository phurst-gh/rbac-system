import type { RequestHandler } from "express";
import { verifyAccessToken } from "../domains/auth";
import { AppError } from "../shared/errors/AppError";
import { ErrorCode } from "../shared/errors/ErrorCode";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(401, ErrorCode.UNAUTHORISED, "Missing token");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);  // Returns JWTPayload
    req.user = payload;  // JWTPayload with 'sub'
    next();
  } catch (error) {
    const err = error as Error;

    if (err.name === "TokenExpiredError") {
      throw new AppError(401, ErrorCode.TOKEN_EXPIRED, "Access token has expired");
    }

    if (err.name === "JsonWebTokenError") {
      throw new AppError(401, ErrorCode.INVALID_TOKEN, "Invalid access token");
    }

    if (err.name === "NotBeforeError") {
      throw new AppError(401, ErrorCode.TOKEN_NOT_ACTIVE, "Token not active yet");
    }

    // Fallback
    throw new AppError(401, ErrorCode.UNAUTHORISED, "Authentication failed");
  }
};
