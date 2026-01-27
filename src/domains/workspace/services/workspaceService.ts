import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/errors/ErrorCode";
import { workspaceRepository } from "../repositories/workspaceRepository";
import { validateWorkspaceName } from "../validators";

type Workspace = {
  id?: string;
  name: string;
  isPublic: boolean;
  message?: string;
};

type WorkspaceService = {
  createWorkspace(name: string, isPublic: boolean, userId: string): Promise<Workspace>;
  // inviteMember(workspaceId: string, targetUserId: string, currentUserId: string): Promise<void>;
  getUserWorkspaces(userId: string): Promise<Workspace[]>;
  getWorkspaceMembers(workspaceId: string): Promise<any[]>;
};

const createWorkspace = async (name: string, isPublic: boolean, userId: string) => {
  // 1. Validate input
  const validatedName = validateWorkspaceName(name);

  // 2. Check if user already has a workspace with the same name
  const workspaceNameExists = await workspaceRepository.findByUserAndName(userId, validatedName);
  if (workspaceNameExists.length > 0) {
    throw new AppError(
      409,
      ErrorCode.WORKSPACE_NAME_EXISTS,
      `A workspace with the name '${validatedName}' already exists for this user`,
    );
  }

  // 2. Create in database
  const workspace = await workspaceRepository.createWorkspace(validatedName, isPublic, userId);
  if (!workspace) {
    throw new AppError(500, ErrorCode.INTERNAL_SERVER_ERROR, "Failed to create workspace");
  }

  return {
    name: validatedName,
    isPublic,
    message: `Workspace '${validatedName}' created.`,
  };
};

// I need real invites (in app) so users arent automatically added when another user invites them to a workspace
// const inviteMember = async (workspaceId: string, userId: string, targetUserId: string) => {
// const currentUsereMembership = await workspaceRepository.findMembershipByUserAndWorkspace(
//   userId,
//   workspaceId,
// );
// const workspace = await workspaceRepository.findById(workspaceId);
// if (!workspace) {
//   throw new AppError(404, ErrorCode.WORKSPACE_NOT_FOUND, "Workspace not found");
// }
// const isWorkspacePublic = workspace?.isPublic;
// if (currentUsereMembership?.role === "OWNER" || isWorkspacePublic) {
//   await workspaceRepository.createMember(workspaceId, targetUserId, "MEMBER");
//   return {
//     message: `User '${targetUserId}' added to workspace.`,
//   };
// }
// throw new AppError(
//   403,
//   ErrorCode.FORBIDDEN,
//   "You do not have permission to add members to this workspace",
// );
// };

// joinPublicWorkspace(workspaceId, userId)
// check isPublic
// ensure no membership exists
// create membership

const getUserWorkspaces = async (userId: string) => {
  const userWorkspaces = await workspaceRepository.findAllByUser(userId);
  return userWorkspaces;
};

const getWorkspaceMembers = async (workspaceId: string) => {
  const members = await workspaceRepository.findMembersByWorkspace(workspaceId);
  return members;
};

export const workspaceService: WorkspaceService = {
  createWorkspace,
  // inviteMember,
  getUserWorkspaces,
  getWorkspaceMembers,
};
