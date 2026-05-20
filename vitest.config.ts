import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import path from "path";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
    },
  },
  test: {
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    environment: "node",
  },
});
