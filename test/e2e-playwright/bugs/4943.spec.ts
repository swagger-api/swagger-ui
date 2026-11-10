/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#4943: XML example not rendered correctly with oneOf", () => {
  test("should render integer property correctly", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/bugs/4943.yaml")
    await swaggerUi.toggleOperation("#operations-Test-postTest")
    // cy.contains yields the first match among all `.microlight` elements
    await expect(
      page
        .locator(".microlight")
        .filter({ hasText: /<b>0<\/b>/ })
        .first()
    ).toBeAttached()
  })

  test("should render oneOf property correctly", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/bugs/4943.yaml")
    await swaggerUi.toggleOperation("#operations-Test-postTest")
    await swaggerUi.tryItOut()
    // cy.contains yields the first match among all `.microlight` elements
    await expect(
      page
        .locator(".microlight")
        .filter({ hasText: /<c>\n\t<\/c>/ })
        .first()
    ).toBeAttached()
  })
})
