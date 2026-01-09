import { type Router as ExpressRouter, Router } from "express";
import { asyncHandler } from "@/shared/handlers/asyncHandler";
import { createWorkspace } from "./controllers/workspaceController";

const workspaceRouter: ExpressRouter = Router();

workspaceRouter.post("/create", asyncHandler(createWorkspace));

export { workspaceRouter };
  