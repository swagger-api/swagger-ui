/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("Empty JSON Schema 2020-12", () => {
  test("should render as schema of type `any`", async ({ page }) => {
    await page.goto(
      "/?url=/documents/features/json-schema-2020-12-empty-schema.yaml"
    )

    await expect(page.locator(".json-schema-2020-12__title")).toContainText(
      "Test"
    )
    await expect(page.locator(".json-schema-2020-12__attribute")).toContainText(
      "any"
    )
  })
})
