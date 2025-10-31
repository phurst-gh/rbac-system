import { PrismaClient } from "@prisma/client";
import { AppError } from "../../shared/errors/AppError";
import { signAccessToken, signRefreshToken } from "../lib/jwt";

const prisma = new PrismaClient();

export const createUser = async (validatedEmail: string, hashedPassword: string) => {
  const emailExists = await prisma.user.findUnique({ where: { email: validatedEmail } });
  if (emailExists) {
    throw new AppError(409, "EMAIL_EXISTS", "A user with this email already exists");
  }

  const userRole = await prisma.role.findUnique({ where: { name: "user" } });
  if (!userRole) {
    throw new AppError(500, "ROLE_NOT_FOUND", "Default 'user' role not found");
  }

  const newUser = await prisma.user.create({
    data: {
      email: validatedEmail,
      passwordHash: hashedPassword,
      roleId: userRole.id,
    },
    select: { id: true, email: true, createdAt: true },
  });

  const accessToken = signAccessToken({ sub: newUser.id, email: newUser.email });
  const refreshToken = signRefreshToken({ sub: newUser.id });

  return {
    message: "User created successfully",
    user: {
      id: String(newUser.id),
      email: newUser.email,
      createdAt: newUser.createdAt,
      role: userRole.name,
    },
    accessToken,
    refreshToken,
  };
};
