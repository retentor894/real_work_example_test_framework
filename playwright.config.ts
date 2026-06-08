import { defineConfig, devices } from "@playwright/test";

/**
 * UI base URL (the frontend). The API base used for fast test-data setup is
 * configured separately in src/api/conduitApi.ts via API_URL.
 *
 *   npx playwright test                                   # local app on :3000
 *   BASE_URL=https://conduit-realworld-example-app.fly.dev \
 *   API_URL=https://conduit-realworld-example-app.fly.dev/api  npx playwright test
 *
 * The app (frontend + backend) must be running — this suite does not start it.
 */
const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
