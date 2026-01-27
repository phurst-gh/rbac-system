import { type Router as ExpressRouter, Router } from "express";
import { asyncHandler } from "@/shared/handlers/asyncHandler";
import {
  createWorkspace,
  listUserMemberships,
  listWorkspaceMembers,
} from "./controllers/workspaceController";

const workspaceRouter: ExpressRouter = Router();

workspaceRouter.post("/create", asyncHandler(createWorkspace));

workspaceRouter.get("/me/memberships", asyncHandler(listUserMemberships));

workspaceRouter.get("/:workspaceId/members", asyncHandler(listWorkspaceMembers));

export { workspaceRouter };
