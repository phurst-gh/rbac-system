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
        name: true,
        isPublic,
        createdAt: true,
      },
    }),

  createMember: async (workspaceId: string, userId: string, role: WorkspaceRole) =>
    await prisma.workspaceMember.create({
      data: {
        workspaceId, // Is this needed, on the frontend i should have workspace name at this point
        userId,
        role,
      },
    }),

  findAllByUser: async (userId: string) =>
    await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        isPublic: true,
        createdAt: true,
      },
    }),

  findById: async (workspaceId: string) =>
    await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      select: {
        id: true,
        name: true,
        isPublic: true,
        createdAt: true,
      },
    }),

  findByUserAndName: async (userId: string, name: string) =>
    await prisma.workspace.findMany({
      where: {
        name,
        members: {
          some: {
            userId,
          },
        },
      },
    }),

  findMembershipByUserAndWorkspace: async (userId: string, workspaceId: string) =>
    await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    }),

  findMembersByWorkspace: async (workspaceId: string) =>
    await prisma.workspaceMember.findMany({
      where: {
        workspaceId,
      },
    }),

  // delete workspace
  // createMember
  // remove member
  // update member role
};

export { workspaceRepository };
