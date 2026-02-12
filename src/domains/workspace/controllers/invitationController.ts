import type { Request, Response } from "express";
import { asyncHandler } from "@/shared/handlers/asyncHandler";
import { invitationService } from "../services/invitationService";
import { inviteMemberSchema } from "../validators";

const inviteMember = asyncHandler(async (req: Request, res: Response) => {
  const { workspaceId } = req.params;
  const currentUserId = req.user!.sub;

  const validatedData = inviteMemberSchema.parse(req.body);

  const result = await invitationService.inviteMember({
    workspaceId,
    inviterId: currentUserId,
    inviteeEmail: validatedData.email,
  });

  res.status(201).json(result);
});

const removeMember = asyncHandler(async (req: Request, res: Response) => {
  const { workspaceId, memberId } = req.params;
  const currentUserId = req.user!.sub;

  const result = await invitationService.removeMember(workspaceId, memberId, currentUserId);

  res.json(result);
});

const getPendingInvitations = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.sub;

  const invitations = await invitationService.getPendingInvitations(userId);

  res.json(invitations);
});

const acceptInvitation = asyncHandler(async (req: Request, res: Response) => {
  const { invitationId } = req.params;
  const userId = req.user!.sub;

  const result = await invitationService.acceptInvitation(invitationId, userId);

  res.json(result);
});

const declineInvitation = asyncHandler(async (req: Request, res: Response) => {
  const { invitationId } = req.params;
  const userId = req.user!.sub;

  const result = await invitationService.declineInvitation(invitationId, userId);

  res.json(result);
});

export const invitationController = {
  inviteMember,
  removeMember,
  getPendingInvitations,
  acceptInvitation,
  declineInvitation,
};
