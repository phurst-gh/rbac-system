import { type Router as ExpressRouter, Router } from "express";
import { asyncHandler } from "@/shared/handlers/asyncHandler";
import { create } from "./controllers/workspaceController";

const workspaceRouter: ExpressRouter = Router();

workspaceRouter.post("/create", asyncHandler(create));

export { workspaceRouter };
  