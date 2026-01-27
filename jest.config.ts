import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: ".",
  testMatch: ["**/src/**/*.test.ts"],
  moduleNameMapper: {
    "^@/env$": "<rootDir>/env.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@test/(.*)$": "<rootDir>/src/test/$1",
    "^bad-words$": "<rootDir>/src/test/mocks/bad-words.ts", // Mock bad-words package
  },
};

export default config;
