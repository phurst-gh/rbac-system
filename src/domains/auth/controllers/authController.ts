import type { Request, Response } from "express";
import { setRefreshCookie } from "../lib/cookies";
import { authService } from "../services/authService";

const register = async (req: Request, res: Response) => {
  const userData = req.body;
  const result = await authService.register(userData);
  setRefreshCookie(res, result.refreshToken);

  res.status(201).json({
    message: "User registered successfully",
    user: result.user,
    accessToken: result.accessToken,
  });
};

export { register };
