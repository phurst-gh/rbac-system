// This file cointains Express request handlers (controllers)

import type { Request, Response } from "express";
import { requireUser } from "@/shared/auth/requireUser";
// import { AppError } from "@/shared/errors/AppError";
// import { ErrorCode } from "@/shared/errors/ErrorCode";
import { workspaceService } from "../services/workspaceService";

const createWorkspace = async (req: Request, res: Response) => {
  const workspaceName: string = req.body.name;
  const isPublic: boolean = req.body.isPublic;
  const { sub: userId } = requireUser(req);

  const response = await workspaceService.createWorkspace(workspaceName, isPublic, userId);

  res.status(201).json({
    status: "success",
    result: response,
  });
};

// const getWorkspace = async (req: Request, res: Response) => {};

const listUserMemberships = async (req: Request, res: Response) => {
  const { sub: userId } = requireUser(req);

  const workspaces = await workspaceService.getUserWorkspaces(userId);

  res.status(200).json({
    status: "success",
    result: workspaces,
  });
};

const listWorkspaceMembers = async (req: Request, res: Response) => {
  const workspaceId: string = req.params.workspaceId;

  const members = await workspaceService.getWorkspaceMembers(workspaceId);

  res.status(200).json({
    status: "success",
    result: members,
  });
};

// const addMemberToWorkspace = async (req: Request, res: Response) => {
//   // 1. Get workspace
//   const workspaceId: string = req.params.workspaceId;
//   const { sub: userId } = requireUser(req);
//   const targetUserId: string = req.body.userId;

//   if (!targetUserId) {
//     throw new AppError(400, ErrorCode.BAD_REQUEST, "Missing targetUserId");
//   }

//   const response = await workspaceService.createMember(workspaceId, userId, targetUserId);

//   res.status(200).json({
//     status: "success",
//     result: response,
//   });
// };

export { createWorkspace, listUserMemberships, listWorkspaceMembers };
