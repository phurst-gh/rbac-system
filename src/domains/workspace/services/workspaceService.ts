import { userRepository } from "@/domains/auth/repositories/userRepository";
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

type WorkspaceMember = {
  id: string;
  userId: string;
  workspaceId: string;
  role: string;
};

type WorkspaceService = {
  createWorkspace(name: string, isPublic: boolean, userId: string): Promise<Workspace>;
  getUserWorkspaces(userId: string): Promise<Workspace[]>;
  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]>;
};

const createWorkspace = async (name: string, isPublic: boolean, userId: string) => {
  // 1. Validate input
  const validatedName = validateWorkspaceName(name);

  // 2. Check if user has reached max workspaces limit
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError(404, ErrorCode.USER_NOT_FOUND, "User not found");
  }

  const existingWorkspaces = await workspaceRepository.findAllByUser(userId);
  if (existingWorkspaces.length >= user.maxWorkspaces) {
    throw new AppError(
      403,
      ErrorCode.FORBIDDEN,
      `Maximum workspace limit of ${user.maxWorkspaces} reached`,
    );
  }

  // 3. Check if user already has a workspace with the same name
  const workspaceNameExists = await workspaceRepository.findByUserAndName(userId, validatedName);
  if (workspaceNameExists.length > 0) {
    throw new AppError(
      409,
      ErrorCode.WORKSPACE_NAME_EXISTS,
      `A workspace with the name '${validatedName}' already exists for this user`,
    );
  }

  // 4. Create in database
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
  getUserWorkspaces,
  getWorkspaceMembers,
};
