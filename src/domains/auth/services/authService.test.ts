import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/errors/ErrorCode";
import { authService } from "./authService";
import "jest";

// Mocks for all dependencies
jest.mock("../validators", () => ({
  validateEmail: jest.fn((email) => email),
  validatePassword: jest.fn((password) => password),
}));
jest.mock("../lib", () => ({
  hashPassword: jest.fn(async (pw) => "hashed_" + pw),
  verifyPassword: jest.fn(async (pw, hash) => pw === "valid" && hash === "hashed_valid"),
  verifyRefreshToken: jest.fn((token) => {
    if (token === "valid_refresh") return { sub: "user-id" };
    throw new Error("Invalid token");
  }),
}));
jest.mock("../repositories/userRepository", () => ({
  userRepository: {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}));
jest.mock("../repositories/roleRepository", () => ({
  roleRepository: {
    getUserRole: jest.fn(),
  },
}));
jest.mock("../utils/generateJWTs", () => ({
  generateJWTs: jest.fn(() => ({ accessToken: "access", refreshToken: "refresh" })),
}));
jest.mock("@/shared/lib/pino-logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const { validateEmail, validatePassword } = require("../validators");
const { hashPassword, verifyPassword, verifyRefreshToken } = require("../lib");
const { userRepository } = require("../repositories/userRepository");
const { roleRepository } = require("../repositories/roleRepository");
const { generateJWTs } = require("../utils/generateJWTs");
const { logger } = require("@/shared/lib/pino-logger");

const baseUser = {
  id: "user-id",
  email: "user@example.com",
  passwordHash: "hashed_valid",
  createdAt: new Date(),
  role: { name: "user", id: "role-id" },
};

describe("authService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("login", () => {
    it("logs in successfully", async () => {
      userRepository.findByEmail.mockResolvedValue(baseUser);
      verifyPassword.mockResolvedValue(true);
      const result = await authService.login({ email: "user@example.com", password: "valid" });
      expect(result).toMatchObject({
        message: expect.any(String),
        accessToken: "access",
        refreshToken: "refresh",
        user: expect.objectContaining({
          id: baseUser.id,
          email: baseUser.email,
          role: baseUser.role.name,
        }),
      });
    });
    it("throws on non-existent user", async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      await expect(authService.login({ email: "no@user.com", password: "pw" })).rejects.toThrow(
        AppError,
      );
    });
    it("throws on invalid password", async () => {
      userRepository.findByEmail.mockResolvedValue(baseUser);
      verifyPassword.mockResolvedValue(false);
      await expect(
        authService.login({ email: "user@example.com", password: "invalid" }),
      ).rejects.toThrow(AppError);
    });
  });

  describe("register", () => {
    it("registers successfully", async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      roleRepository.getUserRole.mockResolvedValue({ id: "role-id", name: "user" });
      userRepository.create.mockResolvedValue(baseUser);
      const result = await authService.register({ email: "user@example.com", password: "valid" });
      expect(result).toMatchObject({
        message: expect.any(String),
        accessToken: "access",
        refreshToken: "refresh",
        user: expect.objectContaining({
          id: baseUser.id,
          email: baseUser.email,
          role: baseUser.role.name,
        }),
      });
    });
    it("throws if email exists", async () => {
      userRepository.findByEmail.mockResolvedValue(baseUser);
      await expect(
        authService.register({ email: "user@example.com", password: "valid" }),
      ).rejects.toThrow(AppError);
    });
    it("throws if role not found", async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      roleRepository.getUserRole.mockResolvedValue(null);
      await expect(
        authService.register({ email: "user@example.com", password: "valid" }),
      ).rejects.toThrow(AppError);
    });
    it("throws if user creation fails", async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      roleRepository.getUserRole.mockResolvedValue({ id: "role-id", name: "user" });
      userRepository.create.mockResolvedValue(null);
      await expect(
        authService.register({ email: "user@example.com", password: "valid" }),
      ).rejects.toThrow(AppError);
    });
  });

  describe("refreshToken", () => {
    it("refreshes tokens successfully", async () => {
      userRepository.findById.mockResolvedValue(baseUser);
      const result = await authService.refreshToken("valid_refresh");
      expect(result).toEqual({ accessToken: "access", refreshToken: "refresh" });
    });
    it("throws if user not found", async () => {
      userRepository.findById.mockResolvedValue(null);
      await expect(authService.refreshToken("valid_refresh")).rejects.toThrow(AppError);
    });
    it("throws if token is invalid", async () => {
      await expect(authService.refreshToken("invalid_refresh")).rejects.toThrow(AppError);
    });
  });

  describe("logout", () => {
    it("logs out (noop)", async () => {
      await expect(authService.logout("any_refresh")).resolves.toBeUndefined();
      expect(logger.info).toHaveBeenCalled();
    });
  });
});
