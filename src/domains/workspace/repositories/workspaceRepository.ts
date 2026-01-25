import { PrismaClient, WorkspaceRole } from "@prisma/client";

const prisma = new PrismaClient();

// Repository functions must interact with the database
const workspaceRepository = {
  createWorkspace: async (name: string, isPublic: boolean, userId: string) =>
    await prisma.workspace.create({
      data: {
        name,
        isPublic,
        members: {
          create: {
            userId,
            role: WorkspaceRole.OWNER,
          },
        },
      },
      select: {
        id: true,
        name: true,
        isPublic,
        createdAt: true,
      },
    }),

    getUserWorkspaces: async (userId: string) =>
      await prisma.workspace.findMany({
        where: {
          members: {
            some: {
              userId,
            },
          },
        },
      }),
      
    // createMember
};

export { workspaceRepository };