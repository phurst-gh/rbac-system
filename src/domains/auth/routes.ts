import { type Router as ExpressRouter, Router } from "express";
import { asyncHandler } from "../../shared/handlers/asyncHandler";
import { register } from "./controllers/authController";
import { refresh } from "./controllers/refreshToken";

const authRouter: ExpressRouter = Router();

authRouter.post("/register", register);

// TODO: Implement login controller
authRouter.post(
  "/login",
  // asyncHandler(validateEmail),
  // asyncHandler(validatePassword),
  // asyncHandler(loginController)
);

authRouter.post("/refresh", asyncHandler(refresh));

// TODO: Implement logout controller
// authRouter.post("/logout", logoutController);

// TODO: Implement verify controller (for internal service use)
// authRouter.get("/verify", verifyController);

export { authRouter };
