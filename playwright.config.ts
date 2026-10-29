/**
 * @prettier
 */
import { defineConfig, devices } from "@playwright/test"

const isCI = !!process.env.CI

export default defineConfig({
  testDir: "test/e2e-playwright",
  testMatch: "**/*.spec.ts",
  globalSetup: "./test/e2e-playwright/support/global-setup.ts",
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3230",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Cypress ran on Chromium only. To add cross-browser coverage later:
    // { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    // { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: [
    {
      // webpack dev server serving the app and test/e2e-playwright/static
      command: "npm run e2e:server",
      url: "http://localhost:3230",
      reuseExistingServer: !isCI,
      timeout: 300_000,
    },
    {
      command: "npm run e2e:mock-api",
      url: "http://localhost:3204",
      reuseExistingServer: !isCI,
      timeout: 60_000,
    },
  ],
})
