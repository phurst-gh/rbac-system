// This file contains pure logic, no Express.

import { Role } from "@prisma/client";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/errors/ErrorCode";
import { logger } from "@/shared/lib/pino-logger";
import type { ApiUser } from "@/shared/types/express";
import { hashPassword, verifyPassword, verifyRefreshToken } from "../lib";
import { userRepository } from "../repositories/userRepository";
import { generateJWTs } from "../utils/generateJWTs";
import { validateEmail, validatePassword } from "../validators";

export interface AuthResult {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: ApiUser; // API response type (uses 'id')
}

export type RefreshResult = {
  accessToken: string;
  refreshToken: string;
};

/**
 * Core authentication service operations
 * This interface could become a microservice API contract
 */
export interface AuthService {
  login(UserCredentials: UserCredentials): Promise<AuthResult>;
  register(UserCredentials: UserCredentials): Promise<AuthResult>;
  refreshToken(token: string): Promise<RefreshResult>;
  logout(refreshToken: string): Promise<void>;
}

export type UserCredentials = {
  email: string;
  password: string;
};

/**
 * Auth Service Implementation
 *
 * This implementation handles the business logic for authentication.
 * Controllers call these functions and handle HTTP-specific concerns.
 */
const login = async (UserCredentials: UserCredentials): Promise<AuthResult> => {
  // 1. Validate input
  const validatedEmail = validateEmail(UserCredentials.email);
  const validatedPassword = validatePassword(UserCredentials.password);

  // 2. Query database for user
  const user = await userRepository.findByEmail(validatedEmail);
  if (!user) {
    logger.warn(
      {
        operation: "login",
        email: validatedEmail,
      },
      "Login attempt with non-existent email",
    );
    throw new AppError(401, ErrorCode.INVALID_CREDENTIALS, "Invalid email or password");
  }

  // 3. Verify password
  const isPasswordValid = await verifyPassword(validatedPassword, user.passwordHash);
  if (!isPasswordValid) {
    logger.warn(
      {
        operation: "login",
        userId: user.id,
        email: validatedEmail,
      },
      "Login attempt with invalid password",
    );
    throw new AppError(401, ErrorCode.INVALID_CREDENTIALS, "Invalid email or password");
  }

  // 4. Generate tokens
  const { refreshToken: newRefreshToken, accessToken } = generateJWTs(
    user.id,
    user.email,
    user.role,
  );
  // 5. Return result
  logger.info(
    {
      operation: "login",
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    "User logged in successfully",
  );

  return {
    message: "Login successfull",
    accessToken,
    refreshToken: newRefreshToken,
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
    },
  };
};

const register = async (UserCredentials: UserCredentials): Promise<AuthResult> => {
  // 1. Validate input & hash password
  const validatedEmail = validateEmail(UserCredentials.email);
  const validatedPassword = validatePassword(UserCredentials.password);
  const hashedPassword = await hashPassword(validatedPassword);

  // 2. Check if email already exists
  const emailExists = await userRepository.findByEmail(validatedEmail);
  if (emailExists) {
    logger.warn(
      {
        operation: "register",
        email: validatedEmail,
      },
      "Registration attempt with existing email",
    );
    throw new AppError(409, ErrorCode.EMAIL_EXISTS, "A user with this email already exists");
  }

  // 3. Create user in database (Generating only USER role for now)
  const user = await userRepository.create(validatedEmail, hashedPassword, Role.USER);
  if (!user) {
    throw new AppError(500, ErrorCode.INTERNAL_SERVER_ERROR, "Failed to create user");
  }

  // 5. Generate tokens
  const { refreshToken: newRefreshToken, accessToken } = generateJWTs(
    user.id,
    user.email,
    user.role,
  );

  logger.info(
    {
      operation: "register",
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    "User registered successfully",
  );

  return {
    message: "User created successfully",
    accessToken,
    refreshToken: newRefreshToken,
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
    },
  };
};

const refreshToken = async (token: string): Promise<RefreshResult> => {
  try {
    // 1. Verify the refresh token is valid and not expired
    const payload = verifyRefreshToken(token);

    // 2. Verify user still exists
    const user = await userRepository.findById(payload.sub);
    if (!user) {
      throw new AppError(401, ErrorCode.INVALID_REFRESH_TOKEN, "User not found");
    }

    // 3. Generate new tokens with complete user data
    const { refreshToken: newRefreshToken, accessToken } = generateJWTs(
      user.id,
      user.email,
      user.role,
    );

    logger.info(
      {
        operation: "refresh",
        userId: payload.sub,
      },
      "Tokens refreshed successfully",
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    logger.error(
      {
        operation: "refresh",
        err: error,
      },
      "Refresh token verification failed",
    );

    throw new AppError(401, ErrorCode.INVALID_REFRESH_TOKEN, "Refresh token is invalid or expired");
  }
};

const logout = async (refreshToken: string): Promise<void> => {
  // The main work happens in the controller (clearing the cookie)
  // This is just for potential future features like:
  // - Logging the logout event
  // - Blacklisting the refresh token (if you add that later)
  // - Cleanup tasks

  logger.info(
    {
      operation: "logout",
      tokenPrefix: refreshToken.substring(0, 10),
    },
    "User logged out",
  );
};

export const authService: AuthService = {
  login,
  register,
  refreshToken,
  logout,
};
