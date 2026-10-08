/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#4867: callback parameter rendering", () => {
  test("should render parameters correctly", async ({ page, swaggerUi }) => {
    await page.goto("/?url=/documents/bugs/4867.yaml")
    await swaggerUi.toggleOperation("#operations-default-myOp")
    // cy.contains("Callbacks") is scoped to the operation; case-sensitive regex
    await page
      .locator("#operations-default-myOp")
      .getByText(/Callbacks/)
      .click()

    const callbackSummaryPath = page.locator(
      ".callbacks-container .opblock-summary-path"
    )
    await expect(callbackSummaryPath).toHaveAttribute(
      "data-path",
      "http://$request.query.url"
    )
    await callbackSummaryPath.click()

    await expect(page.locator(".parameters-container")).toContainText("myParam")
  })
})
