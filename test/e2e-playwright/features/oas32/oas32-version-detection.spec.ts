/**
 * @prettier
 */
import { test, expect } from "../../support/fixtures"

test.describe("OpenAPI 3.2.0 - Version Detection", () => {
  const baseUrl = "/?url=/documents/oas32/oas32-features.yaml"

  test("should detect and render OAS 3.2.0 spec with all info fields", async ({
    page,
  }) => {
    await page.goto(baseUrl)
    await expect(page.locator(".information-container")).toBeAttached()
    await expect(page.locator(".information-container .title")).toContainText(
      "OAS 3.2.0 Basic Features"
    )
    await expect(
      page.locator(".information-container .description")
    ).toContainText("basic features implemented for OpenAPI 3.2.0")
    await expect(
      page.locator(".information-container .info__summary")
    ).toContainText("Demonstrates basic OpenAPI 3.2.0 implementation")
    await expect(page.locator(".version-pragma__message--missing")).toHaveCount(
      0
    )
  })
})
