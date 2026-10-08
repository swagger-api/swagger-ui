/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#5188: non-string operation summary value", () => {
  test("should gracefully handle an object value for an operation summary", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("?url=/documents/bugs/5188.yaml")
    await swaggerUi.toggleOperation("#operations-default-objectSummary")
    // cy.contains is case-sensitive, so use a RegExp rather than a hasText string
    await expect(
      page
        .locator(".opblock-summary-description")
        .filter({ hasText: /OrderedMap \{ "whatever": 123 \}/ })
    ).toBeAttached()
  })

  test("should gracefully handle a missing value for an operation summary", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("?url=/documents/bugs/5188.yaml")
    await swaggerUi.toggleOperation("#operations-default-noSummary")
    // check for response rendering; makes sure the Operation itself rendered
    // (chained `.contains` in Cypress searches within the clicked operation)
    await expect(page.locator("#operations-default-noSummary")).toContainText(
      "Invalid input"
    )
  })
})
