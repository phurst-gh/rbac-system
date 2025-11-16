import type { ErrorCode } from "./ErrorCode";

export class AppError extends Error {
  constructor(
    public status: number,
    public code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
