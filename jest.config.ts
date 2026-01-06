import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  testMatch: ["**/src/**/*.test.ts"],
  moduleNameMapper: {
    "^@/env$": "<rootDir>/env.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
