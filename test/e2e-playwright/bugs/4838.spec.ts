/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#4838: empty request bodies result in endless loading", () => {
  test("should render model content changes correctly", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/bugs/4838.yaml")
    await swaggerUi.toggleOperation("#operations-Some-post_some_route")
    // chained `.contains` in Cypress searches within the clicked operation
    await expect(
      page.locator("#operations-Some-post_some_route")
    ).toContainText("This should be visible")
  })
})
