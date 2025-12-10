import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Repository functions must interact with the database
export const roleRepository = {
  getUserRole: async (userRole: string) =>
    await prisma.role.findUnique({ where: { name: userRole } }),
};
