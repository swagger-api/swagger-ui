/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

/**
 * Related to // https://github.com/swagger-api/swagger-ui/issues/9222.
 */

test.describe("OpenAPI 3.0 Callbacks", () => {
  test("should render all defined callbacks", async ({ page, swaggerUi }) => {
    await page.goto("/?url=/documents/features/oas3-callbacks.yaml")
    await swaggerUi.toggleOperation("#operations-Device-register")
    await page.locator(".opblock-section-header .tab-item.false").click()
    await expect(
      page.locator("#operations-callbacks-callbackOne")
    ).toBeVisible()
    await expect(
      page.locator("#operations-callbacks-callbackTwo")
    ).toBeVisible()
  })
})
