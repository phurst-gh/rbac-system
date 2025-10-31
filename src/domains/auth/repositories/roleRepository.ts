import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const roleRepository = {
  getUserRole: async (userRole: string) =>
    await prisma.role.findUnique({ where: { name: userRole } }),
};
