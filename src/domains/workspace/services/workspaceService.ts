import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/errors/ErrorCode";
import { logger } from "@/shared/lib/pino-logger";

type WorkspaceService = {
  create: (name: string) => void;
}

const create = (name: string) => {
  // validate/sanitise name input
  // interact with repository to create workspace record
  logger.info({ operation: "createWorkspace", name }, `Workspace '${name}' created.`);
  return {
    operation: "createWorkspace",
    name,
    message: `Workspace '${name}' created.`
  };
}

export const workspaceService: WorkspaceService = {
  create,
};