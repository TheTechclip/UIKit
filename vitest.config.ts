import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    globals: true,
    coverage: {
      provider: "v8",
      include: ["packages/**/*.{ts,tsx}"],
      exclude: ["packages/**/*.types.ts"],
      reporter: ["text", "lcov"],
      thresholds: {
        statements: 48,
        branches: 43,
        functions: 49,
        lines: 50,
      },
    },
  },
});
