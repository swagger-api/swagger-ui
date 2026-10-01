/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"
import type { Page } from "@playwright/test"

// Cypress `.get(...).get(...)` chain required each selector to exist, then
// `.contains` checked the badge text.
async function expectBadge(page: Page, url: string, text: string) {
  await page.goto(url)
  await expect(page.locator("#swagger-ui")).toBeAttached()
  await expect(page.locator('*[class^="version-stamp"]').first()).toBeAttached()
  // `.contains` matches the first `pre.version` containing the text (the first one holds the API version)
  await expect(
    page
      .locator("pre.version")
      .filter({ hasText: new RegExp(text.replace(/\./g, "\\.")) })
      .first()
  ).toBeAttached()
}

test.describe("OpenAPI Badge", () => {
  test("should display light green badge with version indicator for Swagger 2.0", async ({
    page,
  }) => {
    await expectBadge(
      page,
      "/?url=/documents/features/info-openAPI2.yaml",
      "OAS 2.0"
    )
  })

  test("should display light green badge with version indicator for OpenAPI 3.0.x", async ({
    page,
  }) => {
    await expectBadge(
      page,
      "/?url=/documents/petstore-expanded.openapi.yaml",
      "OAS 3.0"
    )
  })

  test("should display light green badge with version indicator for OpenAPI 3.1.0", async ({
    page,
  }) => {
    await expectBadge(
      page,
      "/?url=/documents/features/info-openAPI31.yaml",
      "OAS 3.1"
    )
  })

  test("should display light green badge with version indicator for OpenAPI 3.2.0", async ({
    page,
  }) => {
    await expectBadge(
      page,
      "/?url=/documents/oas32/oas32-features.yaml",
      "OAS 3.2"
    )
  })
})
