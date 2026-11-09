/**
 * @prettier
 */
import { defineConfig, devices } from "@playwright/test"

import type { SwaggerUiOptions } from "./test/e2e-playwright/support/fixtures"

const isCI = !!process.env.CI

// Existing specs of the Models/Schemas section and the Schema/Model tab of
// OpenAPI 2.0, 3.0, 3.1 and 3.2 documents, run again with the unified JSON
// Schema view on.
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
  "features/model-collapse.spec.ts",
  "features/parameter-schema.spec.ts",
  "features/schema-rendering.spec.ts",
  "features/external-docs.spec.ts",
  "features/oas3-extension.spec.ts",
  "features/spec-parse-to-json.spec.ts",
  "features/plugins/oas3/all-of-circular-ref.spec.ts",
  "features/plugins/oas3/complex-spec.spec.ts",
  "features/plugins/oas3/request-body-complex-schema-properties.spec.ts",
  "bugs/5660.spec.ts",
  "bugs/6016.spec.ts",
  "bugs/6369.spec.ts",
  "bugs/editor-1868.spec.ts",
  "bugs/swos-63.spec.ts",
  "a11y/response-tabs.spec.ts",
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
        /should render Example tabpanel by default/,
        // external docs of the info, tags and operations, not of schemas
        /External docs feature .* for (Root|Tags|Operation) /,
        // operations and the tab labels only
        /should render (a|expanded Operations of) OAS(2|3)\.0 definition/,
        /SWOS-63.* ModelExample within Operation /,
      ],
    },
    {
      // json-schema-unified's own specs in WebKit (Desktop Safari)
      name: "webkit-unified",
      use: { ...devices["Desktop Safari"] },
      testMatch: "features/plugins/json-schema-unified/*.spec.ts",
    },
    // Cypress ran on Chromium only. To add cross-browser coverage later:
    // { name: "firefox", use: { ...devices["Desktop Firefox"] } },
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
