import { type Router as ExpressRouter, Router } from "express";
import { asyncHandler } from "@/shared/handlers/asyncHandler";
import { requireAuth } from "../../middleware/requireAuth";
import { invitationController } from "./controllers/invitationController";
import {
  createWorkspace,
  listUserMemberships,
  listWorkspaceMembers,
} from "./controllers/workspaceController";

const workspaceRouter: ExpressRouter = Router();

// All workspace routes require authentication
workspaceRouter.use(requireAuth);

workspaceRouter.post("/create", asyncHandler(createWorkspace));

workspaceRouter.get("/me/memberships", asyncHandler(listUserMemberships));

workspaceRouter.get("/:workspaceId/members", asyncHandler(listWorkspaceMembers));

// Invitation routes
workspaceRouter.post("/:workspaceId/invite", asyncHandler(invitationController.inviteMember));
workspaceRouter.delete(
  "/:workspaceId/members/:memberId",
  asyncHandler(invitationController.removeMember),
);

// User's pending invitations
workspaceRouter.get(
  "/invitations/pending",
  asyncHandler(invitationController.getPendingInvitations),
);

// Accept/decline invitations
workspaceRouter.post(
  "/invitations/:invitationId/accept",
  asyncHandler(invitationController.acceptInvitation),
);
workspaceRouter.post(
  "/invitations/:invitationId/decline",
  asyncHandler(invitationController.declineInvitation),
);

export { workspaceRouter };
