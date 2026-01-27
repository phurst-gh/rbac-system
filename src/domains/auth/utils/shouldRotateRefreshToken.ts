import type { RefreshTokenPayload } from "@/shared/types/express";

/**
 * Token Rotation Utilities
 *
 * Functions to determine when refresh tokens should be rotated
 * for optimal security vs. performance balance.
 */

/**
 * Determines if a refresh token should be rotated based on its age
 *
 * @param payload - The decoded JWT payload containing issue time (iat)
 * @param rotationThreshold - Fraction of token lifetime after which to rotate (default: 0.5)
 * @returns true if token should be rotated
 */

const shouldRotateRefreshToken = (
  payload: RefreshTokenPayload,
  rotationThreshold: number = 0.5,
): boolean => {
  if (!payload.iat || !payload.exp) return true;

  const now = Math.floor(Date.now() / 1000); // Convert to seconds (JWT standard)
  const tokenAge = now - payload.iat;
  const tokenLifetime = payload.exp - payload.iat;
  // explain this maths to me.

  return tokenAge > tokenLifetime * rotationThreshold;
};

export { shouldRotateRefreshToken };
