/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("JSON Schema 2020-12 uniqueItems keyword", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/?url=/documents/features/json-schema-2020-12-unique-items.yaml"
    )
  })

  test("should render `unique` label", async ({ page }) => {
    // cy `.siblings("span")` -> parent's `span` children
    await expect(
      page
        .getByText(/UniqueItems/)
        .first()
        .locator("xpath=..")
        .locator(":scope > span")
        .getByText(/unique/)
    ).toBeAttached()
  })

  test("should render `unique items` label with range constraints", async ({
    page,
  }) => {
    await expect(
      page
        .getByText(/UniqueItemsAndRangeConstraint/)
        .first()
        .locator("xpath=..")
        .locator(":scope > span")
        .getByText(/\[1, 5\] unique items/)
    ).toBeAttached()
  })
})
