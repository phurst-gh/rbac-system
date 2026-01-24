import type { RequestHandler } from "express";

/**
 * Async Handler Wrapper for Express Routes
 *
 * Problem: Express doesn't automatically catch errors from async route handlers.
 * If an async function throws, it results in an unhandled promise rejection.
 *
 * Solution: This higher-order function wraps async route handlers to:
 * 1. Automatically catch any thrown errors or promise rejections
 * 2. Forward errors to Express error middleware via next(error)
 * 3. Eliminate the need for try/catch blocks in every async route
 *
 * How it works:
 * - Takes an async RequestHandler function as input
 * - Returns a new RequestHandler that wraps the original
 * - Promise.resolve() ensures we're working with a promise (even if fn isn't async)
 * - .catch(next) forwards any errors to Express error middleware
 * 
 * This way, route handlers can focus on business logic without boilerplate error handling.
 */

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
