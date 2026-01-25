import { type Router as ExpressRouter, Router } from "express";
import { asyncHandler } from "@/shared/handlers/asyncHandler";
import { createWorkspace } from "./controllers/workspaceController";
import { get } from "http";

const workspaceRouter: ExpressRouter = Router();

workspaceRouter.post("/create", asyncHandler(createWorkspace));

workspaceRouter.get("/$userId/workspaces", asyncHandler(getUserWorkspaces));

export { workspaceRouter };
  