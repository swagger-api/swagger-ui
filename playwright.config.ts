/**
 * @prettier
 */
import { defineConfig, devices } from "@playwright/test"

import type { SwaggerUiOptions } from "./test/e2e-playwright/support/fixtures"

const isCI = !!process.env.CI

// Existing specs of the Schemas section and the Schema tab of OpenAPI 3.1 and
// 3.2 documents, run again with the unified JSON Schema view on.
const unifiedJSONSchemaParitySpecs = [
  "features/plugins/json-schema-2020-12/*.spec.ts",
  "features/plugins/oas31/oas31-schema-expansion.spec.ts",
  "features/plugins/oas31/oas31-parameter-schema.spec.ts",
  "features/plugins/oas31/oas31-request-body-complex-schema-properties.spec.ts",
  "features/plugins/oas32/oas32-json-schema-rendering.spec.ts",
  "features/plugins/oas32/oas32-schema-expansion.spec.ts",
  "features/plugins/oas32/oas32-request-body-complex-schema-properties.spec.ts",
  "features/oas31-extension.spec.ts",
  "features/oas32-extension.spec.ts",
  "features/models-virtualization.spec.ts",
]

export default defineConfig<SwaggerUiOptions>({
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
    {
      name: "unified-json-schema",
      use: { ...devices["Desktop Chrome"], unifiedJSONSchema: true },
      testMatch: unifiedJSONSchemaParitySpecs,
      grepInvert: [
        // Example Value tab only (not switched by the option)
        /should render example for /,
        // OpenAPI 2.0/3.0 documents keep the classic view
        /\(OpenAPI (2|3)\.0\)/,
      ],
    },
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
