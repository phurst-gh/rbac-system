import jwt from "jsonwebtoken";
import { env } from "@/env";
import type { JWTPayload } from "@/shared/types/express";

// Type used as a TS/JWT compatibility workaround
// Caused by having typed env vars in env.ts
type JwtExpiry = `${number}${"s" | "m" | "h" | "d"}`;

const signAccessToken = (payload: object): string => {
  const expiresIn = env.JWT_ACCESS_EXPIRES_IN as JwtExpiry;
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn });
};

const signRefreshToken = (payload: object): string => {
  const expiresIn = env.JWT_REFRESH_EXPIRES_IN as JwtExpiry;
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn });
};

const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JWTPayload;
};

const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JWTPayload;
};

export { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };
