import type { JwtPayload } from "jsonwebtoken";

// JWT Token Payload (internal - follows RFC 7519)
export interface JWTPayload extends JwtPayload {
  sub: string;     // User ID (JWT standard)
  email?: string;  // Only in access tokens  
  role?: string;   // Only in access tokens
}

// API Response User (external - REST standard)
export interface ApiUser {
  id: string;      // REST API standard (clients expect 'id')
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
