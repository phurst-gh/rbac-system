import type { Role } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Repository functions must interact with the database
const userRepository = {
  findByEmail: async (email: string) =>
    await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true, // Needed for login password verification
        createdAt: true,
        role: true,
      },
    }),

  findById: async (id: string) =>
    await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        role: true,
      },
    }),

  create: async (email: string, passwordHash: string, role: Role) =>
    await prisma.user.create({
      data: { email, passwordHash, role },
      select: {
        id: true,
        email: true,
        createdAt: true,
        role: true,
      },
    }),
};

export { userRepository };
