import type { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
  isActive?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
