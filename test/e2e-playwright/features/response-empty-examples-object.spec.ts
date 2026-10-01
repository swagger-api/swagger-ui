/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Response examples", () => {
  test("should render a generated example when an empty examples object is provided", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto(
      "/?url=/documents/features/response-empty-examples-object.yaml"
    )
    await swaggerUi.toggleOperation("#operations-TEST-test")
    const example = page.locator(".example.microlight")
    await expect(example).toBeAttached()
    await expect(example).toContainText("{}")
    await expect(page.locator(".examples-select-element")).toHaveCount(0)
  })
})
