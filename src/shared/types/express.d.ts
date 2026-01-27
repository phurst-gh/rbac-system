import type { JwtPayload } from "jsonwebtoken";

export type AccessTokenPayload = JwtPayload & {
  sub: string;
  email: string;
  role?: string;
};

export type RefreshTokenPayload = JwtPayload & {
  sub: string;
};

export type JWTPayload = AccessTokenPayload | RefreshTokenPayload;

// API Response User
export interface ApiUser {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload; // Set by requireAuth for access-token protected routes
    }
  }
}
