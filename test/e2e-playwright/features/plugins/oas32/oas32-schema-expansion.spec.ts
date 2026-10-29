/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("OpenAPI 3.2.0 schema expansion", () => {
  test("should expand to the default expansion level", async ({ page }) => {
    await page.goto(
      "/?url=/documents/features/oas32-schema-expansion.yaml&defaultModelsExpandDepth=3&showExtensions=true"
    )

    await expect(
      page
        .locator(".json-schema-2020-12-property")
        .filter({ hasText: "prop2" })
        .first()
    ).toBeAttached()
    await expect(
      page.locator(".json-schema-2020-12-property").filter({ hasText: "prop3" })
    ).toHaveCount(0)

    await expect(
      page
        .locator(".json-schema-2020-12-keyword--xml")
        .filter({ hasText: "x-extension" })
        .first()
    ).toBeAttached()
    await expect(
      page
        .locator(".json-schema-2020-12-keyword--xml")
        .filter({ hasText: "prop1" })
    ).toHaveCount(0)
  })

  test("should deeply expand nested collapsed keywords", async ({ page }) => {
    await page.goto(
      "/?url=/documents/features/oas32-schema-expansion.yaml&showExtensions=true"
    )
    const xmlKeyword = page.locator(".json-schema-2020-12-keyword--xml")

    await page.locator(".json-schema-2020-12-expand-deep-button").click()
    await expect(xmlKeyword.filter({ hasText: "prop4" }).first()).toBeAttached()

    // cy.contains yields the deepest element with the text, so click that rather than the keyword container
    await xmlKeyword.getByText("prop1").first().click()
    await expect(xmlKeyword.filter({ hasText: "prop4" })).toHaveCount(0)

    await xmlKeyword.getByText(/XML/).first().click()
    await page
      .locator(
        ".json-schema-2020-12-keyword--xml .json-schema-2020-12-expand-deep-button"
      )
      .first()
      .click()
    await expect(xmlKeyword.filter({ hasText: "prop4" }).first()).toBeAttached()
  })
})
