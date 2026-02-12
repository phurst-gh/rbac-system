import { userRepository } from "@/domains/auth/repositories/userRepository";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/errors/ErrorCode";
import { workspaceRepository } from "../repositories/workspaceRepository";

type InvitationData = {
  workspaceId: string;
  inviterId: string;
  inviteeEmail: string;
};

type WorkspaceInvitation = {
  id: string;
  workspaceId: string;
  inviterId: string;
  inviteeId: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: Date;
  updatedAt: Date;
};

type InvitationService = {
  inviteMember(data: InvitationData): Promise<{ message: string }>;
  removeMember(
    workspaceId: string,
    memberId: string,
    currentUserId: string,
  ): Promise<{ message: string }>;
  getPendingInvitations(userId: string): Promise<WorkspaceInvitation[]>;
  acceptInvitation(invitationId: string, userId: string): Promise<{ message: string }>;
  declineInvitation(invitationId: string, userId: string): Promise<{ message: string }>;
};

const inviteMember = async (data: InvitationData) => {
  const { workspaceId, inviterId, inviteeEmail } = data;

  // 1. Check if inviter has permission (owner or member)
  const inviterMembership = await workspaceRepository.findMembershipByUserAndWorkspace(
    inviterId,
    workspaceId,
  );
  if (!inviterMembership) {
    throw new AppError(403, ErrorCode.FORBIDDEN, "You are not a member of this workspace");
  }

  // 2. Check if workspace exists
  const workspace = await workspaceRepository.findById(workspaceId);
  if (!workspace) {
    throw new AppError(404, ErrorCode.WORKSPACE_NOT_FOUND, "Workspace not found");
  }

  // 3. Find invitee by email
  const invitee = await userRepository.findByEmail(inviteeEmail);
  if (!invitee) {
    throw new AppError(404, ErrorCode.USER_NOT_FOUND, "User with that email not found");
  }

  // 4. Check if invitee is already a member
  const existingMembership = await workspaceRepository.findMembershipByUserAndWorkspace(
    invitee.id,
    workspaceId,
  );
  if (existingMembership) {
    throw new AppError(409, ErrorCode.ALREADY_EXISTS, "User is already a member of this workspace");
  }

  // 5. Check if there's already a pending invitation
  const existingInvitation = await workspaceRepository.findPendingInvitation(
    workspaceId,
    invitee.id,
  );
  if (existingInvitation) {
    throw new AppError(
      409,
      ErrorCode.ALREADY_EXISTS,
      "User already has a pending invitation to this workspace",
    );
  }

  // 6. Create invitation
  await workspaceRepository.createInvitation({
    workspaceId,
    inviterId,
    inviteeId: invitee.id,
  });

  return { message: "Invitation sent successfully" };
};

const removeMember = async (workspaceId: string, memberId: string, currentUserId: string) => {
  // 1. Check if remover is the owner
  const removerMembership = await workspaceRepository.findMembershipByUserAndWorkspace(
    currentUserId,
    workspaceId,
  );
  if (!removerMembership || removerMembership.role !== "OWNER") {
    throw new AppError(403, ErrorCode.FORBIDDEN, "Only workspace owners can remove members");
  }

  // 2. Check if member exists
  const memberMembership = await workspaceRepository.findMembershipByUserAndWorkspace(
    memberId,
    workspaceId,
  );
  if (!memberMembership) {
    throw new AppError(404, ErrorCode.NOT_FOUND, "User is not a member of this workspace");
  }

  // 3. Cannot remove the owner
  if (memberMembership.role === "OWNER") {
    throw new AppError(403, ErrorCode.FORBIDDEN, "Cannot remove the workspace owner");
  }

  // 4. Remove member
  await workspaceRepository.removeMember(workspaceId, memberId);

  return { message: "Member removed successfully" };
};

const getPendingInvitations = async (userId: string) => {
  const invitations = await workspaceRepository.findPendingInvitationsByUser(userId);
  return invitations;
};

const acceptInvitation = async (invitationId: string, userId: string) => {
  // 1. Check if invitation exists and belongs to user
  const invitation = await workspaceRepository.findInvitationById(invitationId);
  if (!invitation) {
    throw new AppError(404, ErrorCode.NOT_FOUND, "Invitation not found");
  }

  if (invitation.inviteeId !== userId) {
    throw new AppError(403, ErrorCode.FORBIDDEN, "This invitation is not for you");
  }

  if (invitation.status !== "PENDING") {
    throw new AppError(409, ErrorCode.ALREADY_EXISTS, "Invitation has already been processed");
  }

  // 2. Check if user is already a member
  const existingMembership = await workspaceRepository.findMembershipByUserAndWorkspace(
    userId,
    invitation.workspaceId,
  );
  if (existingMembership) {
    throw new AppError(409, ErrorCode.ALREADY_EXISTS, "You are already a member of this workspace");
  }

  // 3. Accept invitation (create membership and update invitation status)
  await workspaceRepository.acceptInvitation(invitationId, userId, invitation.workspaceId);

  return { message: "Invitation accepted successfully" };
};

const declineInvitation = async (invitationId: string, userId: string) => {
  // 1. Check if invitation exists and belongs to user
  const invitation = await workspaceRepository.findInvitationById(invitationId);
  if (!invitation) {
    throw new AppError(404, ErrorCode.NOT_FOUND, "Invitation not found");
  }

  if (invitation.inviteeId !== userId) {
    throw new AppError(403, ErrorCode.FORBIDDEN, "This invitation is not for you");
  }

  if (invitation.status !== "PENDING") {
    throw new AppError(409, ErrorCode.ALREADY_EXISTS, "Invitation has already been processed");
  }

  // 2. Decline invitation
  await workspaceRepository.declineInvitation(invitationId);

  return { message: "Invitation declined" };
};

export const invitationService: InvitationService = {
  inviteMember,
  removeMember,
  getPendingInvitations,
  acceptInvitation,
  declineInvitation,
};
