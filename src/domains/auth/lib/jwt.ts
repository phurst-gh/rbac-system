import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "@/env";
import type { AccessTokenPayload, RefreshTokenPayload } from "@/shared/types/express";

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

// Zod schemas for payload validation: ensure expected types exist after jwt.verify
const basePayloadSchema = z.object({
  sub: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

const accessTokenPayloadSchema = basePayloadSchema.extend({
  email: z.string().email(),
  role: z.string().optional(),
});

const refreshTokenPayloadSchema = basePayloadSchema;

const verifyAccessToken = (token: string): AccessTokenPayload => {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
  return accessTokenPayloadSchema.parse(payload);
};

const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
  return refreshTokenPayloadSchema.parse(payload);
};

export { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };
