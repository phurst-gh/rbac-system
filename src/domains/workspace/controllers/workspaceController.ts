// This file cointains Express request handlers (controllers)

import type { Request, Response } from "express";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/errors/ErrorCode";
import { workspaceService } from "../services/workspaceService";

const createWorkspace = async (req: Request, res: Response) => {
  const workspaceName: string = req.body.name;
  const isPublic: boolean = req.body.isPublic;
  const userId = req.user?.sub;

  if (!userId) throw new AppError(401, ErrorCode.UNAUTHORISED, "Missing user");

  const response = await workspaceService.createWorkspace(workspaceName, isPublic, userId);

  res.status(201).json({
    status: "success",
    result: response,
  });
};

const getWorkspace = async (req: Request, res: Response) => {
  // To be implemented
};

const listUserMemberships = async (req: Request, res: Response) => {
  const userId: string = req.user?.sub;

  if (!userId) {
    throw new AppError(400, ErrorCode.BAD_REQUEST, "Missing userId parameter");
  }

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

const addMemberToWorkspace = async (req: Request, res: Response) => {
  // 1. Get workspace
  const workspaceId: string = req.params.workspaceId;
  const userId: string = req.user?.sub;
  const targetUserId: string = req.body.userId;

  if (!targetUserId) {
    throw new AppError(400, ErrorCode.BAD_REQUEST, "Missing targetUserId");
  }

  const response = await workspaceService.createMember(workspaceId, userId, targetUserId);

  res.status(200).json({
    status: "success",
    result: response,
  });
};

export { createWorkspace, listUserMemberships, listWorkspaceMembers, addMemberToWorkspace };
