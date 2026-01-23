// This file cointains Express request handlers (controllers)

import type { Request, Response } from "express";
import { workspaceService } from "../services/workspaceService";

const create = async (req: Request, res: Response) => {
  const workspaceName: string = req.body.name;
  const response = await workspaceService.create(workspaceName);

  res.status(201).json({
    status: "success",
    result: response,
  })
}

export { create };
