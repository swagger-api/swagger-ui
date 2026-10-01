/**
 * @prettier
 */
import { test, expect } from "../../support/fixtures"

test.describe("OpenAPI 3.2.0 - Component-Only Specification", () => {
  const baseUrl = "/?url=/documents/oas32/component-only.yaml"

  test("should render component-only spec with all fields", async ({
    page,
  }) => {
    await page.goto(baseUrl)
    await expect(page.locator(".information-container")).toBeAttached()
    await expect(page.locator(".version-pragma__message--missing")).toHaveCount(
      0
    )
    await expect(page.locator(".information-container .title")).toContainText(
      "Component-Only Specification"
    )
    await expect(
      page.locator(".information-container .description")
    ).toContainText("valid OAS 3.2.0 specification")
    await expect(page.locator(".opblock-tag-section")).toHaveCount(0)
  })
})
