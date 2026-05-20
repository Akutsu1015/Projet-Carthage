import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:3000",
    trace: "retain-on-failure",
    viewport: { width: 1280, height: 800 },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  // If no server is already running, start one. Comment out if you start the server manually.
  webServer: process.env.E2E_NO_SERVER
    ? undefined
    : {
        command: "npm run next-dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
