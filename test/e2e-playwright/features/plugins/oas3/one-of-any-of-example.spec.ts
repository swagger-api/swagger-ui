/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

test.describe("OpenAPI 3.0 oneOf and anyOf example", () => {
  test("should show example values for multipart/form-data and application/x-www-form-urlencoded content types", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/features/oas3-one-of-any-of-example.yaml")

    await page.getByText("/documentsWithCombineOneOf").click()
    await swaggerUi.tryItOut()
    // cy.contains on a textarea reads its text content, which is its initial value
    await expect(page.locator("textarea")).toHaveValue(
      /NestedSchemaExample\.pdf/
    )
    await page.getByText("/documentsWithCombineOneOf").click()
    await page.getByText("/documentsWithCombineAnyOf").click()
    await page
      .locator(".try-out__btn")
      .filter({ hasText: /Try it out/ })
      .click()
    await expect(page.locator("textarea")).toHaveValue(
      /ParentSchemaExample\.pdf/
    )
  })
})
