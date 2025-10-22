import { type Router as ExpressRouter, Router } from "express";
import { asyncHandler } from "../shared/handlers/asyncHandler";
import { createUser, hashPassword, validateEmail, validatePassword } from "./controllers";
import { refresh } from "./controllers/refreshToken";

const authRouter: ExpressRouter = Router();

authRouter.post(
  "/register",
  asyncHandler(validateEmail),
  asyncHandler(validatePassword),
  asyncHandler(hashPassword),
  asyncHandler(createUser),
);

// TODO: Implement login controller
authRouter.post(
  "/login",
  asyncHandler(validateEmail),
  asyncHandler(validatePassword),
  // asyncHandler(loginController) // TODO: Create this
);

authRouter.post("/refresh", asyncHandler(refresh));

// TODO: Implement logout controller
authRouter.post(
  "/logout",
  // asyncHandler(logoutController) // TODO: Create this
);

// TODO: Implement verify controller (for internal service use)
authRouter.get(
  "/verify",
  // asyncHandler(verifyController) // TODO: Create this
);

export { authRouter };
