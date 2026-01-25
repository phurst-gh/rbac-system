import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/errors/ErrorCode";
import { logger } from "@/shared/lib/pino-logger";
import { workspaceRepository } from "../repositories/workspaceRepository";
import { validateWorkspaceName } from "../validators";

type Workspace = {
  id: string;
  name: string;
  isPublic: boolean;
  message: string; // optional? As not needed in getUserWorkspaces
}

type WorkspaceService = {
  create(name: string, isPublic: boolean, role: string): Promise<Workspace>;
  getUserWorkspaces(userId: string): Promise<Workspace[]>;
}

const create = async (name: string, isPublic: boolean, role: string) => {
  // 1. Validate input
  const validatedName = validateWorkspaceName(name);

  // 2. Create in database
  const workspace = await workspaceRepository.createWorkspace(validatedName, isPublic, role);
  if (!workspace) {
    throw new AppError(500, ErrorCode.INTERNAL_SERVER_ERROR, "Failed to create workspace");
  }

  logger.info({
      operation: "create_workspace",
      workspaceId: workspace.id,
      name: validatedName,
      isPublic,
    },
    `Workspace '${validatedName}' created.`
  );

  return {
    id: workspace.id,
    name: validatedName,
    isPublic,
    message: `Workspace '${validatedName}' created.`,
  };
}

const getUserWorkspaces = async (userId: string) => {
  // ... Fetch workspaces from database
};

export const workspaceService: WorkspaceService = {
  create,
  getUserWorkspaces,
};
