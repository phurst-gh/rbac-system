import { type Router as ExpressRouter, Router } from "express";
import { asyncHandler } from "@/shared/handlers/asyncHandler";
import {
  addMemberToWorkspace,
  createWorkspace,
  listUserWorkspaces,
} from "./controllers/workspaceController";

const workspaceRouter: ExpressRouter = Router();

workspaceRouter.post("/create", asyncHandler(createWorkspace));

workspaceRouter.get("/:userId/workspaces", asyncHandler(listUserWorkspaces));

workspaceRouter.post("/:workspaceId/memberships", asyncHandler(addMemberToWorkspace));

export { workspaceRouter };
