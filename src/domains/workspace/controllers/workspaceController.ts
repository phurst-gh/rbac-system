// This file cointains Express request handlers (controllers)

import type { Request, Response } from "express";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/errors/ErrorCode";
import { workspaceService } from "../services/workspaceService";

const create = async (req: Request, res: Response) => {
  const workspaceName: string = req.body.name;
  const isPublic: boolean = req.body.isPublic;
  const userId = req.user?.sub;

  if (!userId) throw new AppError(401, ErrorCode.UNAUTHORISED, "Missing user");


  const response = await workspaceService.create(workspaceName, isPublic, userId);

  res.status(201).json({
    status: "success",
    result: response,
  })
}

export { create };
