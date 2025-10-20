export class AppError extends Error {
  constructor(
    public status: number = 500,
    public code: string = "INTERNAL_SERVER_ERROR",
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
