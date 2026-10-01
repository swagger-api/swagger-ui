/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("OpenAPI 3.1.0 response with empty content", () => {
  test("should render a response", async ({ page }) => {
    await page.goto(
      "/?configUrl=/configs/oas31-response-no-content.yaml&url=/documents/features/oas31-response-empty-content.yaml"
    )
    await page.locator("#operations-Enterprise-get_enterprise_detail").click()
    // `[data-code="404"]` is quoted: Playwright rejects the unquoted numeric value Cypress/jQuery accepted
    await expect(
      page.locator(
        `#operations-Enterprise-get_enterprise_detail [data-code="404"] .response-col_description__inner`
      )
    ).toContainText("No enterprise matching the requested ID could be found.")
    await expect(
      page.locator(
        `#operations-Enterprise-get_enterprise_detail [data-code="404"] .model-example`
      )
    ).toHaveCount(0)
  })
})
