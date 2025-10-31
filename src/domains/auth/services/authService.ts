// This file contains pure logic, no Express.
import { AppError } from "../../../shared/errors/AppError";
import type { UserPayload } from "../../../shared/types/express";
import { ROLE_NAMES } from "../constants";
import { hashPassword, setRefreshCookie } from "../lib";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { roleRepository } from "../repositories/roleRepository";
import { userRepository } from "../repositories/userRepository";
import { validateEmail, validatePassword } from "../validators";

export interface AuthResult {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: UserPayload;
}

export interface RefreshResult {
  accessToken: string;
}

/**
 * Core authentication service operations
 * This interface could become a microservice API contract
 */
export interface AuthService {
  login(email: string, password: string): Promise<AuthResult>;
  register(userData: RegisterData): Promise<AuthResult>;
  refresh(refreshToken: string): Promise<RefreshResult>;
  logout(refreshToken: string): Promise<void>;
  verifyToken(accessToken: string): Promise<UserPayload>;
}

export interface RegisterData {
  email: string;
  password: string;
}

/**
 * Auth Service Implementation
 *
 * This implementation handles the business logic for authentication.
 * Controllers call these methods and handle HTTP-specific concerns.
 */
export class AuthServiceImpl implements AuthService {
  async login(email: string, password: string): Promise<AuthResult> {
    // TODO: Implement actual login logic
    // 1. Validate email/password
    // 2. Query database for user
    // 3. Verify password hash
    // 4. Generate tokens
    // 5. Return result

    throw new AppError(501, "NOT_IMPLEMENTED", "Login not implemented yet");
  }

  async register(userData: RegisterData): Promise<AuthResult> {
    const validatedEmail = validateEmail(userData.email);
    const validatedPassword = validatePassword(userData.password);
    const hashedPassword = await hashPassword(validatedPassword);

    const emailExists = await userRepository.findByEmail(validatedEmail);
    if (emailExists) {
      throw new AppError(409, "EMAIL_EXISTS", "A user with this email already exists");
    }
    const userRole = await roleRepository.getUserRole(ROLE_NAMES.USER);
    if (!userRole) {
      throw new AppError(500, "ROLE_NOT_FOUND", `Role not found: ${ROLE_NAMES.USER}`);
    }

    const user = await userRepository.create(validatedEmail, hashedPassword, userRole.id);
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id });

    return {
      message: "User created successfully",
      user: {
        id: String(user.id),
        email: user.email,
        createdAt: user.createdAt,
        role: userRole.name,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<RefreshResult> {
    try {
      // Verify the refresh token is valid and not expired
      const payload = verifyRefreshToken(refreshToken);

      // Generate new access token
      const accessToken = signAccessToken({ sub: payload.sub });

      return { accessToken };
    } catch (error) {
      throw new AppError(401, "INVALID_REFRESH_TOKEN", "Refresh token is invalid or expired");
    }
  }

  async logout(refreshToken: string): Promise<void> {
    // TODO: Implement token blacklisting or database cleanup
    // In a real implementation, you might:
    // 1. Add token to blacklist
    // 2. Remove from active sessions table
    // 3. Clear any cached user data

    console.log(`Logout called for token: ${refreshToken.substring(0, 10)}...`);
  }

  async verifyToken(accessToken: string): Promise<UserPayload> {
    // This is implemented in the existing JWT utilities
    // Could be moved here for consistency
    throw new AppError(501, "NOT_IMPLEMENTED", "Verify token not implemented yet");
  }
}

// Export singleton instance
export const authService = new AuthServiceImpl();
