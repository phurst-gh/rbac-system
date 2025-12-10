import type { Response } from "express";
import { env, isProd } from "@/env";

export function setRefreshCookie(res: Response, token: string) {
  res.cookie("refresh_token", token, {
    httpOnly: env.COOKIE_HTTP_ONLY,
    secure: isProd(), // Auto-secure in production
    sameSite: env.COOKIE_SAME_SITE,
    path: "/auth", // Available to all auth endpoints (refresh, logout)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    domain: env.COOKIE_DOMAIN || undefined,
  });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie("refresh_token", {
    path: "/auth", // Must match the path used in setRefreshCookie
    domain: env.COOKIE_DOMAIN || undefined,
  });
}
