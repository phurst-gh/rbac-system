import type { Request } from "express";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/errors/ErrorCode";
import type { AccessTokenPayload } from "@/shared/types/express";

export const requireUser = (req: Request): AccessTokenPayload => {
  if (!req.user) {
    throw new AppError(401, ErrorCode.UNAUTHORISED, "Missing user");
  }

  return req.user;
};
