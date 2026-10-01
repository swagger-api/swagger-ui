/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("JSON Schema 2020-12 title keyword", () => {
  test("should render a correct title for schemas", async ({ page }) => {
    await page.goto("/?url=/documents/features/json-schema-2020-12-title.yaml")

    const titles = page.locator(".json-schema-2020-12__title")
    await expect(titles.nth(0)).toContainText("My Pet")
    await expect(titles.nth(1)).toContainText("My Pets")
    await expect(titles.nth(2)).toContainText("Error")
  })
})
