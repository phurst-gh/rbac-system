import { Role } from "@prisma/client";
import { AppError } from "@/shared/errors/AppError";
import { userRepository } from "../repositories/userRepository";
import { authService } from "./authService";

jest.mock("../repositories/userRepository");
jest.mock("../lib", () => ({
  hashPassword: jest.fn(async (pw) => `hashed_${pw}`),
  verifyPassword: jest.fn(async (pw, hash) => pw === "Test123!" && hash === "hashed_Test123!"),
  verifyRefreshToken: jest.fn((token) => {
    if (token === "valid_refresh") return { sub: "user-id" };
    throw new Error("Invalid token");
  }),
}));
jest.mock("../utils/generateJWTs", () => ({
  generateJWTs: jest.fn(() => ({ accessToken: "access", refreshToken: "refresh" })),
}));

const mockedUserRepo = jest.mocked(userRepository);

const testUser = {
  id: "user-id",
  email: "user@example.com",
  passwordHash: "hashed_Test123!",
  createdAt: new Date(),
  role: Role.USER,
};

describe("authService", () => {
  afterEach(() => jest.clearAllMocks());

  describe("login", () => {
    it("should return user and tokens when email and password are valid", async () => {
      mockedUserRepo.findByEmail.mockResolvedValue(testUser);
      const result = await authService.login({ email: "user@example.com", password: "Test123!" });
      expect(result.user.email).toBe("user@example.com");
      expect(result.accessToken).toBe("access");
    });

    it("should throw AppError when user email does not exist in database", async () => {
      mockedUserRepo.findByEmail.mockResolvedValue(null);
      await expect(
        authService.login({ email: "no@user.com", password: "Test123!" }),
      ).rejects.toThrow(AppError);
    });

    it("should throw AppError when password does not match stored hash", async () => {
      mockedUserRepo.findByEmail.mockResolvedValue(testUser);
      await expect(
        authService.login({ email: "user@example.com", password: "WrongPassword1!" }),
      ).rejects.toThrow(AppError);
    });
  });

  describe("register", () => {
    it("should create user with USER role and return tokens on success", async () => {
      mockedUserRepo.findByEmail.mockResolvedValueOnce(null);
      mockedUserRepo.create.mockResolvedValue(testUser);
      const result = await authService.register({
        email: "user@example.com",
        password: "Test123!",
      });
      expect(result.user.email).toBe("user@example.com");
      expect(mockedUserRepo.create).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        Role.USER,
      );
    });

    it("should throw AppError if email is already registered", async () => {
      mockedUserRepo.findByEmail.mockResolvedValue(testUser);
      await expect(
        authService.register({ email: "user@example.com", password: "Test123!" }),
      ).rejects.toThrow(AppError);
    });
  });

  describe("refreshToken", () => {
    it("should generate new access and refresh tokens when token is valid", async () => {
      mockedUserRepo.findById.mockResolvedValue(testUser);
      const result = await authService.refreshToken("valid_refresh");
      expect(result).toEqual({ accessToken: "access", refreshToken: "refresh" });
    });

    it("should throw AppError if user ID from token is not found in database", async () => {
      mockedUserRepo.findById.mockResolvedValue(null);
      await expect(authService.refreshToken("valid_refresh")).rejects.toThrow(AppError);
    });

    it("should throw AppError if refresh token is invalid or expired", async () => {
      await expect(authService.refreshToken("invalid")).rejects.toThrow(AppError);
    });
  });
});
