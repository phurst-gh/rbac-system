import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userRepository = {
  findByEmail: async (email: string) => await prisma.user.findUnique({ where: { email } }),
  create: async (email: string, passwordHash: string, roleId: number) =>
    await prisma.user.create({
      data: { email, passwordHash, roleId },
      select: { id: true, email: true, createdAt: true },
    }),
};

export { userRepository };
