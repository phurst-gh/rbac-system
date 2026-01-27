// This file cointains Express request handlers (controllers)

import type { Request, Response } from "express";
import { clearRefreshCookie, setRefreshCookie } from "../lib/cookies";
import { authService } from "../services/authService";

const register = async (req: Request, res: Response) => {
  const UserCredentials = req.body;
  const result = await authService.register(UserCredentials);
  setRefreshCookie(res, result.refreshToken);

  res.status(201).json({
    status: "success",
    user: result.user,
    accessToken: result.accessToken,
  });
};

const login = async (req: Request, res: Response) => {
  const UserCredentials = req.body;
  const result = await authService.login(UserCredentials);
  setRefreshCookie(res, result.refreshToken);

  res.status(200).json({
    message: result.message,
    status: "success",
    data: result.user,
    accessToken: result.accessToken,
  });
};

const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refresh_token;

  // Just logs for now - potential use in future for token blacklisting
  // But keeps the codebase predictable and consistent
  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  clearRefreshCookie(res);

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

const refreshToken = async (req: Request, res: Response) => {
  const result = await authService.refreshToken(req.cookies.refresh_token);

  setRefreshCookie(res, result.refreshToken);

  res.status(200).json({
    status: "success",
    accessToken: result.accessToken,
  });
};

// No interface need for authController.ts, like in authService.ts, because the output is only HTTP side effects..
// ...whereas the authService functions are consumed by other code so they should.
export { register, login, logout, refreshToken };
