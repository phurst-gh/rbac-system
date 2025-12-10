import { type Router as ExpressRouter, Router } from "express";
import { asyncHandler } from "../../shared/handlers/asyncHandler";
import { login, logout, refreshToken, register } from "./controllers/authController";

const authRouter: ExpressRouter = Router();

authRouter.post("/register", asyncHandler(register));

authRouter.post("/login", asyncHandler(login));

authRouter.post("/logout", asyncHandler(logout));

authRouter.post("/refresh-token", asyncHandler(refreshToken));

// TODO: Implement verify controller (for internal service use)
// authRouter.get("/verify", verifyController);

export { authRouter };
