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
        role: { select: { name: true } },
      },
    }),
  findById: async (id: string) =>
    await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        role: { select: { name: true } },
      },
    }),
  create: async (email: string, passwordHash: string, roleId: number) =>
    await prisma.user.create({
      data: { email, passwordHash, roleId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        role: { select: { name: true } },
      },
    }),
};

export { userRepository };
