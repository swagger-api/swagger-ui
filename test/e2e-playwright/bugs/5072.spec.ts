/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#5072: x-www-form-urlencoded request body input when `properties` is missing", () => {
  test("should provide a JSON input for an empty object schema", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("?url=/documents/bugs/5072/empty.yaml")
    await swaggerUi.toggleOperation("#operations-default-postObject")
    await swaggerUi.tryItOut()
    await expect(
      page.locator(`.opblock-section-request-body textarea`)
    ).toHaveValue("{}")
  })

  test("should provide a JSON input for an additionalProperties object schema", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("?url=/documents/bugs/5072/additional.yaml")
    await swaggerUi.toggleOperation("#operations-default-postObject")
    await swaggerUi.tryItOut()
    // cy.contains on a textarea matches its text; assert on its value instead
    await expect(
      page.locator(`.opblock-section-request-body textarea`)
    ).toHaveValue(/"additionalProp1": "string"/)
  })
})
