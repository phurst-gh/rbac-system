import type { JwtPayload } from "jsonwebtoken";

export interface JWTPayload extends JwtPayload {
  sub: string;
  email?: string;  // Only in access tokens  
  role?: string;   // Only in access tokens
}

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
      user?: JWTPayload;  // Express middleware uses JWT payload
    }
  }
}
