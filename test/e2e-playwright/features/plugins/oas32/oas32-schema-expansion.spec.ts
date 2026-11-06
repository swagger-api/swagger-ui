/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("OpenAPI 3.2.0 schema expansion", () => {
  test("should expand to the default expansion level", async ({
    page,
    schemaUi,
  }) => {
    await page.goto(
      "/?url=/documents/features/oas32-schema-expansion.yaml&defaultModelsExpandDepth=3&showExtensions=true"
    )

    await expect(
      schemaUi.property().filter({ hasText: "prop2" }).first()
    ).toBeAttached()
    await expect(schemaUi.property().filter({ hasText: "prop3" })).toHaveCount(
      0
    )

    await expect(
      schemaUi.keyword("xml").filter({ hasText: "x-extension" }).first()
    ).toBeAttached()
    await expect(
      schemaUi.keyword("xml").filter({ hasText: "prop1" })
    ).toHaveCount(0)
  })

  test("should deeply expand nested collapsed keywords", async ({
    page,
    schemaUi,
  }) => {
    await page.goto(
      "/?url=/documents/features/oas32-schema-expansion.yaml&showExtensions=true"
    )
    const xmlKeyword = schemaUi.keyword("xml")

    await schemaUi.expandDeepButton().click()
    await expect(xmlKeyword.filter({ hasText: "prop4" }).first()).toBeAttached()

    // cy.contains yields the deepest element with the text, so click that rather than the keyword container
    await xmlKeyword.getByText("prop1").first().click()
    await expect(xmlKeyword.filter({ hasText: "prop4" })).toHaveCount(0)

    await xmlKeyword.getByText(/XML/).first().click()
    await schemaUi.expandDeepButton(xmlKeyword).first().click()
    await expect(xmlKeyword.filter({ hasText: "prop4" }).first()).toBeAttached()
  })
})
