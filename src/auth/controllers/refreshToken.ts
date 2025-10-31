import type { RequestHandler } from "express";
import { AppError } from "../../shared/errors/AppError";
import { setRefreshCookie } from "../lib/cookies";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";

/**
 * Refresh Token Controller
 *
 * This endpoint allows clients to obtain a new access token using their refresh token.
 * It implements token rotation for enhanced security - each refresh operation
 * generates a new refresh token and invalidates the old one.
 */
export const refresh: RequestHandler = (req, res, next) => {
  try {
    const token = req.cookies?.refresh_token;

    if (!token) {
      throw new AppError(401, "NO_REFRESH", "Missing refresh token");
    }

    // Throws an error if token is invalid, expired, or tampered with
    const payload = verifyRefreshToken(token);

    // SECURITY: Token Rotation
    // Generate a new refresh token to replace the current one
    // This prevents refresh token reuse attacks and limits token lifetime
    const newRefresh = signRefreshToken({ sub: payload.sub });

    // Set the new refresh token as an HTTP-only cookie
    // This replaces the old refresh token in the client's browser
    setRefreshCookie(res, newRefresh);

    // Generate a new short-lived access token for API requests
    // Access tokens are typically valid for 15-30 minutes
    const accessToken = signAccessToken({ sub: payload.sub });

    // Return the new access token to the client
    // Client will use this for authenticated API requests
    res.json({ accessToken });
  } catch (err) {
    // Pass any errors to the global error handler
    // Common errors: invalid token, expired token, malformed token
    next(err);
  }
};
