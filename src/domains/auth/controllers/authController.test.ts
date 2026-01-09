import type { Request, Response } from "express";
import { AppError } from "@/shared/errors/AppError";
import { ErrorCode } from "@/shared/errors/ErrorCode";
import { clearRefreshCookie, setRefreshCookie } from "../lib/cookies";
import { authService } from "../services/authService";
import { login, logout, refreshToken, register } from "./authController";

jest.mock("../services/authService");
jest.mock("../lib/cookies");

const mockedAuthService = jest.mocked(authService);
const mockedSetRefreshCookie = jest.mocked(setRefreshCookie);
const mockedClearRefreshCookie = jest.mocked(clearRefreshCookie);

const mockRequest = (overrides = {}) =>
  ({
    body: {},
    cookies: {},
    ...overrides,
  }) as unknown as Request;

const mockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
};

const testAuthResult = {
  message: "Success",
  accessToken: "access_token",
  refreshToken: "refresh_token",
  user: {
    id: "user-id",
    email: "user@example.com",
    role: "USER",
    createdAt: new Date(),
  },
};

describe("authController", () => {
  afterEach(() => jest.clearAllMocks());

  describe("register", () => {
    it("should create user and return 201 with tokens", async () => {
      const req = mockRequest({ body: { email: "user@example.com", password: "Test123!" } });
      const res = mockResponse();

      mockedAuthService.register.mockResolvedValue(testAuthResult);

      await register(req, res);

      expect(mockedAuthService.register).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "Test123!",
      });
      expect(mockedSetRefreshCookie).toHaveBeenCalledWith(res, "refresh_token");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        user: testAuthResult.user,
        accessToken: "access_token",
      });
    });

    it("should propagate auth service errors", async () => {
      const req = mockRequest({ body: { email: "user@example.com", password: "Test123!" } });
      const res = mockResponse();

      const error = new AppError(400, ErrorCode.EMAIL_EXISTS, "Email already registered");
      mockedAuthService.register.mockRejectedValue(error);

      await expect(register(req, res)).rejects.toThrow(error);
      expect(mockedSetRefreshCookie).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should authenticate user and return 200 with tokens", async () => {
      const req = mockRequest({ body: { email: "user@example.com", password: "Test123!" } });
      const res = mockResponse();

      mockedAuthService.login.mockResolvedValue(testAuthResult);

      await login(req, res);

      expect(mockedAuthService.login).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "Test123!",
      });
      expect(mockedSetRefreshCookie).toHaveBeenCalledWith(res, "refresh_token");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: testAuthResult.user,
        accessToken: "access_token",
      });
    });

    it("should propagate auth service errors", async () => {
      const req = mockRequest({ body: { email: "user@example.com", password: "wrong" } });
      const res = mockResponse();

      const error = new AppError(401, ErrorCode.INVALID_CREDENTIALS, "Invalid email or password");
      mockedAuthService.login.mockRejectedValue(error);

      await expect(login(req, res)).rejects.toThrow(error);
      expect(mockedSetRefreshCookie).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should clear refresh cookie and return success message when token exists", async () => {
      const req = mockRequest({ cookies: { refresh_token: "valid_token" } });
      const res = mockResponse();

      mockedAuthService.logout.mockResolvedValue(undefined);

      await logout(req, res);

      expect(mockedAuthService.logout).toHaveBeenCalledWith("valid_token");
      expect(mockedClearRefreshCookie).toHaveBeenCalledWith(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Logged out successfully",
      });
    });

    it("should clear refresh cookie even if no token in cookies", async () => {
      const req = mockRequest({ cookies: {} });
      const res = mockResponse();

      await logout(req, res);

      expect(mockedAuthService.logout).not.toHaveBeenCalled();
      expect(mockedClearRefreshCookie).toHaveBeenCalledWith(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Logged out successfully",
      });
    });

    it("should handle logout service errors gracefully", async () => {
      const req = mockRequest({ cookies: { refresh_token: "token" } });
      const res = mockResponse();

      const error = new Error("Service error");
      mockedAuthService.logout.mockRejectedValue(error);

      await expect(logout(req, res)).rejects.toThrow(error);
    });
  });

  describe("refreshToken", () => {
    it("should return new tokens and set refresh cookie", async () => {
      const req = mockRequest({ cookies: { refresh_token: "valid_token" } });
      const res = mockResponse();

      mockedAuthService.refreshToken.mockResolvedValue({
        accessToken: "new_access",
        refreshToken: "new_refresh",
      });

      await refreshToken(req, res);

      expect(mockedAuthService.refreshToken).toHaveBeenCalledWith("valid_token");
      expect(mockedSetRefreshCookie).toHaveBeenCalledWith(res, "new_refresh");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        accessToken: "new_access",
      });
    });

    it("should propagate auth service errors", async () => {
      const req = mockRequest({ cookies: { refresh_token: "invalid_token" } });
      const res = mockResponse();

      const error = new AppError(401, ErrorCode.INVALID_TOKEN, "Invalid or expired token");
      mockedAuthService.refreshToken.mockRejectedValue(error);

      await expect(refreshToken(req, res)).rejects.toThrow(error);
      expect(mockedSetRefreshCookie).not.toHaveBeenCalled();
    });
  });
});
