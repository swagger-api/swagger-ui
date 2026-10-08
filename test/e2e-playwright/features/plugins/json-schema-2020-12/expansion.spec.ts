/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("JSON Schema 2020-12 complex keywords expansion", () => {
  test("should deeply expand all Schemas and complex keywords", async ({
    page,
  }) => {
    await page.goto("/pages/json-schema-2020-12-expansion/")

    // cy.get implicitly asserts existence, keeps the "not exist" check below from passing before render
    await expect(
      page.locator(".json-schema-2020-12-accordion").first()
    ).toBeAttached()
    await expect(
      page.locator(
        ".json-schema-2020-12-accordion .json-schema-2020-12-accordion__icon--collapsed"
      )
    ).toHaveCount(0)
    // cy.contains yields the first match, so `.first()` is the equivalent
    await expect(page.getByText(/anyOf1-p1-p2-p1/).first()).toBeAttached()
    await expect(page.getByText(/oneOf1-p1-p2-p1/).first()).toBeAttached()
    await expect(page.getByText(/Prefix items/).first()).toBeAttached()
    await expect(page.getByText(/exampleDef/).first()).toBeAttached()
    await expect(
      page
        .getByText(/https:\/\/json-schema\.org\/draft\/2020-12\/vocab\/core/)
        .first()
    ).toBeAttached()
  })
})
