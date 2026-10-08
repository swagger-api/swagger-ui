/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("ApiKey Authorization", () => {
  test("should have generic description for authorization button", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/petstore.swagger.yaml")
    // open authorization dialog
    await page.locator(".btn.authorize").click()
    // only deal with api_key for this test
    const apiKeyScheme = page.locator(".modal-ux-content > :nth-child(2)")
    await expect(
      apiKeyScheme.locator(".auth-btn-wrapper .authorize")
    ).toHaveAttribute("aria-label", "Apply credentials")
  })
})
