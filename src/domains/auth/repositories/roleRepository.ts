import { PrismaClient } from "@prisma/client";
import { AppError } from "../../../shared/errors/AppError";

const prisma = new PrismaClient();

type Role = { id: number; name: string };

export const roleRepository = {
  async getUserRole(userRole: string): Promise<Role> {
    const role = await prisma.role.findUnique({ where: { name: userRole } });
    if (!role) {
      throw new AppError(500, "ROLE_NOT_FOUND", `Role not found: ${userRole}`);
    }
    return role;
  },
};
