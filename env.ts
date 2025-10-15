/**
 * Environment Variable Validation
 * 
 * This file provides type-safe, validated access to environment variables.
 * 
 * 1. App crashes at startup (not runtime) if misconfigured
 * 2. All env vars are properly typed - no more `process.env.PORT || 3000`
 * 
 * How it works:
 * - Load appropriate .env file based on APP_STAGE (dev/test/prod)
 * - Define Zod schema with all required/optional environment variables
 * - Parse process.env against schema, with helpful error messages
 * - Export typed `env` object that's guaranteed to have valid values
 * 
 * Usage:
 * 1. Import this file into index.ts
 * 2. Instead of `server.listen({ port: 3000 }, ...})`, use `server.listen({ port: env.PORT }, ...})`
 */

import { config as loadEnv } from "dotenv";
import { z } from "zod";

process.env.APP_STAGE = process.env.APP_STAGE || "dev";

const isProduction = process.env.APP_STAGE === "prod";
const isDevelopment = process.env.APP_STAGE === "dev";
const isTesting = process.env.APP_STAGE === "test";

if (isDevelopment) {
  loadEnv();
} else if (isTesting) {
  loadEnv({ path: ".env.test" });
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  APP_STAGE: z.enum(["dev", "prod", "test"]).default("dev"),

  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().startsWith("postgresql://"),
  POSTGRES_PASSWORD: z.string().nonempty("POSTGRES_PASSWORD is required"),

  JWT_SECRET: z.string().min(32, "Must be 32 characters long"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
});

export type Env = z.infer<typeof envSchema>;
let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (e) {
  if (e instanceof z.ZodError) {
    console.error("\n🚨 Environment Configuration Error\n");
    console.error("The following environment variables are missing or invalid:\n");

    e.issues.forEach((issue, index) => {
      const path = issue.path.join(".");
      const message = issue.message;
      console.error(`  ${index + 1}. ${path}`);
      console.error(`     └─ ${message}\n`);
    });

    console.error("💡 Please check your .env file or environment variables");
    process.exit(1);
  }

  throw e;
}

export const isProd = () => env.APP_STAGE === "prod";
export const isDev = () => env.APP_STAGE === "dev";
export const isTest = () => env.APP_STAGE === "test";

export { env };
export default env;
