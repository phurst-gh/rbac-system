import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import { env } from "@/env";
import { AppError } from "../errors/AppError";
import { emailSchema, passwordSchema } from "../schema/zod";

const prisma = new PrismaClient();

export const validateEmail: RequestHandler = (req, res, next) => {
  const { email } = req.body;
  const parsedEmail = emailSchema.safeParse({ email });

  if (!parsedEmail.success) {
    const errorMessage = parsedEmail.error.issues.map(({ message }) => message).join(", ");

    throw new AppError(400, "VALIDATION_ERROR", errorMessage);
  }

  res.locals.validatedEmail = parsedEmail.data.email;
  console.log("Validated Email:", res.locals.validatedEmail);
  next();
};

export const validatePassword: RequestHandler = (req, res, next) => {
  const { password } = req.body;
  const parsedPassword = passwordSchema.safeParse({ password });

  if (!parsedPassword.success) {
    const errorMessage = parsedPassword.error.issues
      .map((issue: { message: string }) => issue.message)
      .join(", ");

    throw new AppError(400, "VALIDATION_ERROR", errorMessage);
  }

  res.locals.validatedPassword = parsedPassword.data.password;
  next();
};

export const hashPassword: RequestHandler = async (_req, res, next) => {
  const password = res.locals.validatedPassword;

  res.locals.validatedPassword = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
  console.log("Password Hash:", res.locals.validatedPassword);
  next();
};

export const createUser: RequestHandler = async (_req, res, next) => {
  const { validatedEmail, validatedPassword } = res.locals;

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
      passwordHash: validatedPassword,
      roleId: userRole.id,
    },
    select: { id: true, email: true, createdAt: true },
  });

  res.status(201).json({
    message: "User created successfully",
    data: {
      user: newUser,
      // accessToken: ...
    },
  });
};
